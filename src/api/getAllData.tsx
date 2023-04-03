import { getTeamsForOrg } from "./getTeamsForOrg";
import { getReposForTeam } from "./getReposForTeam";
import { getVulnsFromRepo } from "./getVulnsFromRepo";

import { Org, Team, Repository} from "../utils/types";
import { formatVulnData } from "../utils/functions";

export const getAllData = (graphql:any,  orgLogin: string) => {
  return getAllRawData(graphql, orgLogin)
};

export async function getAllRawData(graphql:any, orgLogin:string): Promise<any> {
  let seen = new Set<string>
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
    teams: []
  }

  let teamNodes: Team[] = await getTeamsForOrg(graphql, orgLogin)

  for(let teamNode of teamNodes) {
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
    orgData.vulnData.startMonth = new Date().getMonth() + 1
    teamData.vulnData.startMonth = new Date().getMonth() + 1

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

      for(let vulns of newVulnsFormatted){
        let createdDate = new Date(vulns.createdAt)
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
            newRepo.critical += 1
            teamData.vulnData.critical[createdDate.getMonth() - 1] += 1
            teamData.vulnData.criticalNum += 1
            if(!seen.has(id)) {
              orgData.vulnData.critical[createdDate.getMonth() - 1] += 1
              orgData.vulnData.criticalNum += 1
            }
          }
          else if(vulns.severity == "HIGH"){
            newRepo.high += 1
            teamData.vulnData.high[createdDate.getMonth() - 1] += 1
            teamData.vulnData.highNum += 1
            if(!seen.has(id)) {
              orgData.vulnData.high[createdDate.getMonth() - 1] += 1
              orgData.vulnData.highNum += 1
            }
          }
          else if(vulns.severity == "MODERATE"){
            newRepo.moderate += 1
            teamData.vulnData.moderate[createdDate.getMonth() - 1] += 1
            teamData.vulnData.moderateNum += 1
            if(!seen.has(id)) {
              orgData.vulnData.moderate[createdDate.getMonth() - 1] += 1
              orgData.vulnData.moderateNum += 1
            }
          }
          if(vulns.severity == "LOW"){
            newRepo.low += 1
            teamData.vulnData.low[createdDate.getMonth() - 1] += 1
            teamData.vulnData.lowNum += 1
            if(!seen.has(id)) {
              orgData.vulnData.low[createdDate.getMonth() - 1] += 1
              orgData.vulnData.lowNum += 1
            }
          }
        }
      }
      seen.add(id)
      teamData.repos.push(newRepo)
    }
    orgData.teams.push(teamData)
  }
  return orgData 
}