import { countOpenVulnData } from '../utils/functions';
import {
    Teams, 
    Team,
    VulnInfoUnformatted,
  } from '../utils/types';
import { getReposForTeam } from './getReposForTeam';
import { getVulnsFromRepo } from './getVulnsFromRepo';

export async function getVulnCountsForAllTeams(graphql:any, teamNames: Team[], orgName: string): Promise<Team[]> {
    let CountedTeamVulns : Team;

    for (var team of teamNames){
        const TeamVulns: VulnInfoUnformatted[] = []; 
        let repos = await getReposForTeam(graphql, orgName, team.name);

        if (repos.length == 0){
            return teamNames;
        }

        //let vulns = await getVulnsFromRepos(graphql, repos.map(a => a.id), orgName, true);
        for (var repo of repos){
            let vulns = await getVulnsFromRepo(graphql, repo.name, orgName, true);

            if (vulns.length == 0){
                continue
            }

            for (var vulnInfo of vulns) {
                TeamVulns.push(vulnInfo);
            }
        }
        
        if (TeamVulns.length != 0){
            CountedTeamVulns = countOpenVulnData(TeamVulns);

            team.critical = CountedTeamVulns.critical;
            team.high = CountedTeamVulns.high;
            team.moderate = CountedTeamVulns.moderate;
            team.low = CountedTeamVulns.low;
        }
    }

    return teamNames;
}