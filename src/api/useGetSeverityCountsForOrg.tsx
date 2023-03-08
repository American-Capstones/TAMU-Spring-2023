/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
import { getVulnerabilitiesFromRepo } from './getVulnerabilitiesFromRepo';
import { useGetRepositoriesForTeam } from './useGetRepositoriesForTeam';
import { useGetTeamsForOrg } from './useGetTeamsForOrg';

export function getSeverityCountsForOrg() {
        let TeamsInOrg = useGetTeamsForOrg("baggage-claim-incorporated", 10);
        useGetRepositoriesForTeam("baggage-claim-incorporated", "Team A", 10);

        TeamsInOrg.then((Teams) => {
            for (var Team of Teams){
                console.log("team ", Team);
                /*let ReposInTeam = useGetRepositoriesForTeam("baggage-claim-incorporated", Team.name, 10); //says invalid use of hook here?.

                ReposInTeam.then((Repos) => {
                    for (var Repo of Repos){
                        getVulnerabilitiesFromRepo(Repo.name, "baggage-claim-incorporated");
                    }
                });*
            }
        });
        
    }
*/


import { sortVulnData } from '../utils/functions';

import {
  Repositories, 
  Repository, 
  Team,
  Teams,
  VulnInfoRepo,
  VulnInfoUnformatted,
} from '../utils/types';
import { getVulnerabilitiesFromRepo } from './getVulnerabilitiesFromRepo';
import { useGetRepositoriesForTeam } from './useGetRepositoriesForTeam';
import { useGetTeamsForOrg } from './useGetTeamsForOrg';
import { useOctokitGraphQl } from './useOctokitGraphQl';

const GITHUB_GRAPHQL_MAX_ITEMS = 100;

export const useGetSeverityCountsForOrg = () => {
    const graphql_1 = useOctokitGraphQl<Teams<Team[]>>();
    const graphql_2 = useOctokitGraphQl<Repositories>();
    const graphql_3 = useOctokitGraphQl<VulnInfoRepo<VulnInfoUnformatted[]>>();
    const AllVulns: VulnInfoUnformatted[] = [];   
    const ReposVisited: string[] = [];

    let TeamsInOrg = useGetTeamsForOrg(graphql_1, "baggage-claim-incorporated", 10);

    TeamsInOrg.then((Teams) => {
        for (var Team of Teams){
            let ReposInTeam = useGetRepositoriesForTeam(graphql_2, "baggage-claim-incorporated", Team.name, 10);

            ReposInTeam.then((Repos) => {
                for (var Repo of Repos){
                    if (!ReposVisited.includes(Repo.ID)){
                        let vulns = getVulnerabilitiesFromRepo(graphql_3, Repo.name, "baggage-claim-incorporated");
                        vulns.then((vulnInfo) =>{
                            AllVulns.push(...vulnInfo);
                            console.log(AllVulns);
                        });
                        ReposVisited.push(Repo.ID);
                    }   
                }
            });
        }
        const test = sortVulnData(AllVulns);
        console.log("test", test);
    });

    
};
