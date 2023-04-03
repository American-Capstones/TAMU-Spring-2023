import { getTeamsForOrg } from "./getTeamsForOrg";
import { getReposForTeam } from "./getReposForTeam";
import { getVulnsFromRepo } from "./getVulnsFromRepo";

import { Org, Team, Topic, Repository} from "../utils/types";
import { formatVulnData } from "../utils/functions";

export const getAllData = (graphql:any,  orgLogin: string) => {
  return getAllRawData(graphql, orgLogin)
};

export async function getAllRawData(graphql:any, orgLogin:string): Promise<any> {
  let seen = new Set<string>

  let seenTopics =new Map<string, Topic >(); 

  let orgData:Org = {
    name: orgLogin,
    vulnData: {
      startMonth: undefined,
      critical: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      high: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      moderate: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      low: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      criticalNum: 0,
      highNum: 0,
      moderateNum: 0,
      lowNum: 0,
    },
    teams: [],
    repos: [],
    topics: [],
  }

  let teamNodes: Team[] = await getTeamsForOrg(graphql, orgLogin)

  for(let teamNode of teamNodes) {
    // console.log("team ", teamNode.name);
    let teamData:Team = {
      name: teamNode.name,
      vulnData: {
        startMonth: undefined,
        critical: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        high: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        moderate: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        low: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        criticalNum: 0,
        highNum: 0,
        moderateNum: 0,
        lowNum: 0,
      },
      repos: []
    }
    orgData.vulnData.startMonth = new Date().getMonth() + 1
    teamData.vulnData.startMonth = new Date().getMonth() + 1

    let newRepos:Repository[] = await getReposForTeam(graphql, orgLogin, teamNode.name)

    for (let newRepo of newRepos){
      let newVulns = await getVulnsFromRepo(graphql, newRepo.name, orgLogin)
      let newVulnsFormatted = formatVulnData(newVulns)
      newRepo.critical = 0
      newRepo.high = 0
      newRepo.moderate = 0
      newRepo.low = 0

      let topicsCriticalNum: number = 0;
      let topicsHighNum: number = 0;
      let topicsModerateNum: number = 0;
      let topicsLowNum: number = 0;

      let topicsCritical: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let topicsHigh: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let topicsModerate: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let topicsLow: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      for(let vulns of newVulnsFormatted){
        let createdDate = new Date(vulns.createdAt)
        let today = new Date()

        if(today.getFullYear() - createdDate.getFullYear() == 0 || 
          (today.getFullYear() - createdDate.getFullYear() == 1 && createdDate.getMonth() - today.getMonth() > 0)) {
          if(vulns.severity == "CRITICAL"){

            if (vulns.state == "OPEN"){
              newRepo.critical += 1
              teamData.vulnData.criticalNum += 1
            }

            teamData.vulnData.critical[createdDate.getMonth() - 1] += 1

            if(!seen.has(newRepo.id)) {
              if (vulns.state == "OPEN"){
                orgData.vulnData.criticalNum += 1
                topicsCriticalNum += 1
              }

              orgData.vulnData.critical[createdDate.getMonth() - 1] += 1
              topicsCritical[createdDate.getMonth() - 1] += 1
            }
          }
          else if(vulns.severity == "HIGH"){

            if (vulns.state == "OPEN"){
              newRepo.high += 1
              teamData.vulnData.highNum += 1
            }

            teamData.vulnData.high[createdDate.getMonth() - 1] += 1
            
            if(!seen.has(newRepo.id)) {
              if (vulns.state == "OPEN"){
                orgData.vulnData.highNum += 1
                topicsHighNum += 1
              }

              orgData.vulnData.high[createdDate.getMonth() - 1] += 1
              topicsHigh[createdDate.getMonth() - 1] += 1
            }
          }
          else if(vulns.severity == "MODERATE"){

            if (vulns.state == "OPEN"){
              newRepo.moderate += 1
              teamData.vulnData.moderateNum += 1
            }

            teamData.vulnData.moderate[createdDate.getMonth() - 1] += 1
            if(!seen.has(newRepo.id)) {

              if (vulns.state == "OPEN"){
                orgData.vulnData.moderateNum += 1
                topicsModerateNum += 1
              }

              orgData.vulnData.moderate[createdDate.getMonth() - 1] += 1
              topicsModerate[createdDate.getMonth() - 1] += 1
            }
          }
          if(vulns.severity == "LOW"){

            if (vulns.state == "OPEN"){
              newRepo.low += 1
              teamData.vulnData.lowNum += 1
            }

            teamData.vulnData.low[createdDate.getMonth() - 1] += 1
            if(!seen.has(newRepo.id)) {

              if (vulns.state == "OPEN"){
                orgData.vulnData.lowNum += 1
                topicsLowNum += 1
              }

              orgData.vulnData.low[createdDate.getMonth() - 1] += 1
              topicsLow[createdDate.getMonth() - 1] += 1
            }
          }
        }
      }

      if(!seen.has(newRepo.id)) {
        orgData.repos.push(newRepo);
      }

      if(!seen.has(newRepo.id)){
        for (let topic of newRepo.repositoryTopics){
          if(topic != ", " && seenTopics.has(topic)){
            // We can assume that the get statements will always return a value, based on the if statement above.
            seenTopics.get(topic)!.vulnData.criticalNum += topicsCriticalNum;
            seenTopics.get(topic)!.vulnData.highNum += topicsHighNum;
            seenTopics.get(topic)!.vulnData.moderateNum += topicsModerateNum;
            seenTopics.get(topic)!.vulnData.lowNum += topicsLowNum;

            seenTopics.get(topic)!.vulnData.critical = seenTopics.get(topic)!.vulnData.critical.map((a, i) => a + topicsCritical[i]);
            seenTopics.get(topic)!.vulnData.high = seenTopics.get(topic)!.vulnData.high.map((a, i) => a + topicsHigh[i]);
            seenTopics.get(topic)!.vulnData.moderate = seenTopics.get(topic)!.vulnData.moderate.map((a, i) => a + topicsModerate[i]);
            seenTopics.get(topic)!.vulnData.low = seenTopics.get(topic)!.vulnData.low.map((a, i) => a + topicsLow[i]);

            seenTopics.get(topic)!.repos.push(newRepo);
          }
          else if (topic != ", " && !seenTopics.has(topic)){
            console.log(topic);
            let newTopic: Topic = {
              name: topic,
              vulnData: {
                startMonth: new Date().getMonth() + 1,
                critical: topicsCritical,
                high: topicsHigh,
                moderate: topicsModerate,
                low: topicsLow,
                criticalNum: topicsCriticalNum,
                highNum: topicsHighNum,
                moderateNum: topicsModerateNum,
                lowNum: topicsLowNum,
              },
              repos: [newRepo]
            }
  
            seenTopics.set(topic, newTopic);
          } 
        }
      }

      seen.add(newRepo.id)
      teamData.repos.push(newRepo)

    }
    
    orgData.teams.push(teamData)
  }
  orgData.topics.push(...seenTopics.values());
  console.log("orgData", orgData);

  return orgData 
}