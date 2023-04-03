import { countOpenVulnData } from '../utils/functions';
import {
    Repository, 
    VulnInfoUnformatted
  } from '../utils/types';
import { getVulnsFromRepo } from './getVulnsFromRepo';

export async function getVulnCountsForAllRepos(graphql:any, repoNames: Repository[], orgName: string): Promise<Repo[]> {
    for (var repo of repoNames){
        let vulns = await getVulnsFromRepo(graphql, repo.name, orgName, true);
        const CountedRepoVulns = countOpenVulnData(vulns);
            
        if (CountedRepoVulns){
            repo.critical = CountedRepoVulns.critical;
            repo.high = CountedRepoVulns.high;
            repo.moderate = CountedRepoVulns.moderate;
            repo.low = CountedRepoVulns.low;
        }
    }

    return repoNames;
}