import { getTeamsForOrg } from "./getTeamsForOrg";
import { getReposForTeam } from "./getReposForTeam";
import { getVulnsFromRepo } from "./getVulnsFromRepo";
import { formatVulnData } from "../utils/functions";

import { monthVulns } from "../utils/types";

export const getMonthlyVulns = (graphql:any,  orgLogin: string) => {
  return getMonthVulns(graphql, orgLogin)
};
export async function getMonthVulns(graphql:any, orgLogin:string): Promise<any> {
  let teams = await getTeamsForOrg(graphql, orgLogin)
  let monthVulns:monthVulns = {
    critical: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    high: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    moderate: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    low: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }

  let seen = new Set<string>();
  for(let team of teams) {
    let newRepos = await getReposForTeam(graphql, orgLogin, team.name)
    for ( let newRepo of newRepos){
      if(!seen.has(newRepo.ID)) {
        seen.add(newRepo.ID)
        let newVulns = await getVulnsFromRepo(graphql, newRepo.name, orgLogin)
        let newVulnsFormatted = formatVulnData(newVulns)
        for( let vulns of newVulnsFormatted){
          let createdDate = new Date(vulns.createdAt)
          let today = new Date()
          if(today.getFullYear() - createdDate.getFullYear() == 0)
            if(vulns.severity == "CRITICAL"){
              monthVulns.critical[createdDate.getMonth()] += 1
            }
            else if(vulns.severity == "HIGH"){
              monthVulns.high[createdDate.getMonth()] += 1
            }
            if(vulns.severity == "MODERATE"){
              monthVulns.moderate[createdDate.getMonth()] += 1
            }
            if(vulns.severity == "LOW"){
              monthVulns.low[createdDate.getMonth()] += 1
            }
        }
      }
    }
  }
  return monthVulns
}