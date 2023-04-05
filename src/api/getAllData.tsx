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
    url: "",
    avatarUrl: ""
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
      offenses: 0,
      repos: []
    }
    orgData.vulnData.startMonth = new Date().getMonth() 
    teamData.vulnData.startMonth = new Date().getMonth()

    let newRepos:Repository[] = await getReposForTeam(graphql, orgLogin, teamNode.name)

    for (let newRepo of newRepos){
      let offenses = new Set<string>
      let newVulns = await getVulnsFromRepo(graphql, newRepo.name, orgLogin)
      let newVulnsFormatted = formatVulnData(newVulns)
      newRepo.critical = 0
      newRepo.high = 0
      newRepo.moderate = 0
      newRepo.low = 0
      const repoJSON = JSON.parse(JSON.stringify(newRepo))
      const id = repoJSON.id

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
        let createdIndex = createdDate.getMonth()
        let dismissedIndex = vulns.dismissedAt != null ? new Date(vulns.dismissedAt).getMonth() : -1

        let today = new Date()
        const vulnJSON = JSON.parse(JSON.stringify(vulns))
        const vulnName = vulnJSON.packageName
        if(vulns.dismissedAt){
          offenses.add(vulnName)
        }
        else {
          if(offenses.has(vulnName)) {
            teamData.offenses += 1
          }
        }
        if(today.getFullYear() - createdDate.getFullYear() == 0 || 
          (today.getFullYear() - createdDate.getFullYear() == 1 && createdDate.getMonth() - today.getMonth() > 0)) {
          if(vulns.severity == "CRITICAL"){

            if (vulns.state == "OPEN"){
              newRepo.critical += 1
              teamData.vulnData.criticalNum += 1
            }
            
            let i = createdIndex
            do {
              i %= 12
              teamData.vulnData.critical[i] += 1
              i += 1
            } while(i != dismissedIndex && i != today.getMonth() + 1)

            if(!seen.has(id)) {
              if (vulns.state == "OPEN"){
                orgData.vulnData.criticalNum += 1
                topicsCriticalNum += 1
              }

              let i = createdIndex
              do {
                i %= 12
                orgData.vulnData.critical[i] += 1
                topicsCritical[i] += 1
                i += 1
              } while(i != dismissedIndex && i != today.getMonth() + 1) 
            }
          }
          else if(vulns.severity == "HIGH"){

            if (vulns.state == "OPEN"){
              newRepo.high += 1
              teamData.vulnData.highNum += 1
            }

            let i = createdIndex
            do{
              i %= 12
              teamData.vulnData.high[i] += 1
              i += 1
            } while(i != dismissedIndex && i != today.getMonth() + 1)

            if(!seen.has(id)) {
              if (vulns.state == "OPEN"){
                orgData.vulnData.highNum += 1
                topicsHighNum += 1
              }
              let i = createdIndex
              do {
                i %= 12
                orgData.vulnData.high[i] += 1
                topicsHigh[i] += 1
                i += 1
              } while(i != dismissedIndex && i != today.getMonth() + 1) 
            }
          }
          else if(vulns.severity == "MODERATE"){

            if (vulns.state == "OPEN"){
              newRepo.moderate += 1
              teamData.vulnData.moderateNum += 1
            }

            let i = createdIndex
            do {
              i %= 12
              teamData.vulnData.moderate[i] += 1
              i += 1
            } while(i != dismissedIndex && i != today.getMonth() + 1) 

            if(!seen.has(id)) {
              if (vulns.state == "OPEN"){
                orgData.vulnData.moderateNum += 1
                topicsModerateNum += 1
              }

              let i = createdIndex
              do {
                i %= 12
                orgData.vulnData.moderate[i] += 1
                topicsModerate[i] += 1
                i += 1
              } while(i != dismissedIndex && i != today.getMonth() + 1) 
            }
          }
          if(vulns.severity == "LOW"){

            if (vulns.state == "OPEN"){
              newRepo.low += 1
              teamData.vulnData.lowNum += 1
            }

            let i = createdIndex
            do {
              i %= 12
              teamData.vulnData.low[i] += 1
              i += 1
            } while(i != dismissedIndex && i != today.getMonth() + 1)

            if(!seen.has(id)) {

              if (vulns.state == "OPEN"){
                orgData.vulnData.lowNum += 1
                topicsLowNum += 1
              }

              let i = createdIndex
              do {
                i %= 12
                orgData.vulnData.low[i] += 1
                topicsLow[i] += 1
                i += 1
              } while(i != dismissedIndex && i != today.getMonth() + 1) 
            }
          }
        }
      }

      if(!seen.has(id)) {
        orgData.repos.push(newRepo);
      }

      if(!seen.has(id)){
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

      seen.add(id)
      teamData.repos.push(newRepo)

    }
    
    orgData.teams.push(teamData)
  }
  orgData.topics.push(...seenTopics.values());

  return orgData 
}