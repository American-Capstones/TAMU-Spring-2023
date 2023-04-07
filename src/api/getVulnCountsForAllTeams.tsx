import { countOpenVulnData } from '../utils/functions';
import {
    Team,
    VulnInfoUnformatted,
} from '../utils/types';
import { getReposForTeam } from './getReposForTeam';
import { getVulnsFromRepo } from './getVulnsFromRepo';

export async function getVulnCountsForAllTeams(graphql: any, teamNames: Team[], orgName: string): Promise<Team[]> {
    let CountedTeamVulns: Team;
    let seen = new Map<string, VulnInfoUnformatted[]>();

    for (var team of teamNames) {
        const TeamVulns: VulnInfoUnformatted[] = [];
        let repos = await getReposForTeam(graphql, orgName, team.name);

        if (repos.length == 0) {
            return teamNames;
        }

        //let vulns = await getVulnsFromRepos(graphql, repos.map(a => a.id), orgName, true);
        for (var repo of repos) {
            if (!seen.has(repo.id)) {
                let vulns = await getVulnsFromRepo(graphql, repo.name, orgName, true);
                if (vulns.length == 0) {
                    continue
                }
                TeamVulns.push(...vulns);
                seen.set(repo.id, vulns);
            }
            else {
                let vulns = seen.get(repo.id);
                if (vulns.length == 0) {
                    continue
                }
                TeamVulns.push(...vulns);
            }
        }

        if (TeamVulns.length != 0) {
            CountedTeamVulns = countOpenVulnData(TeamVulns);

            team.critical = CountedTeamVulns.critical;
            team.high = CountedTeamVulns.high;
            team.moderate = CountedTeamVulns.moderate;
            team.low = CountedTeamVulns.low;
        }
    }

    return teamNames;
}