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
  VulnInfoUnformatted,
} from '../utils/types';
import { getVulnerabilitiesFromRepo } from './getVulnerabilitiesFromRepo';
import { useGetRepositoriesForTeam } from './useGetRepositoriesForTeam';
import { useGetTeamsForOrg } from './useGetTeamsForOrg';
import { InputError } from '@backstage/errors'

export const useGetSeverityCountsForOrg = async (
    orgLogin: string,
    teamLimit: number, 
    repoLimit: number,
    ) => {
    // const graphql_1 = useOctokitGraphQl<Teams<Team[]>>();
    // const graphql_2 = useOctokitGraphQl<Repositories>();
    // const graphql_3 = useOctokitGraphQl<VulnInfoRepo<VulnInfoUnformatted[]>>();
    const AllVulns: VulnInfoUnformatted[] = [];   
    const ReposVisited: string[] = [];

    let TeamsInOrg = await useGetTeamsForOrg(orgLogin, teamLimit);

    for (var Team of TeamsInOrg) {
        let ReposForTeams = await useGetRepositoriesForTeam(orgLogin, Team.name, repoLimit);

        for (var Repo of ReposForTeams) {
            if (!ReposVisited.includes(Repo.ID)){
                let vulns = await getVulnerabilitiesFromRepo(Repo.name, orgLogin);
                
                for (var vulnInfo of vulns) {
                    AllVulns.push(vulnInfo);
                }

                ReposVisited.push(Repo.ID);
            }  
        }
    }
    const sortedVulnData = sortVulnData(AllVulns);
    //console.log("test", test);
  
    // This comment is left in for learning purposes at the moment;
    // TO teach us the difference between nested promises and using async await
    // TeamsInOrg.then((Teams) => {
        // for (var Team of Teams){
    //         let ReposInTeam = useGetRepositoriesForTeam(graphql_2, "baggage-claim-incorporated", Team.name, 10);

    //         ReposInTeam.then((Repos) => {
    //             for (var Repo of Repos){
    //                 if (!ReposVisited.includes(Repo.ID)){
    //                     let vulns = getVulnerabilitiesFromRepo(graphql_3, Repo.name, "baggage-claim-incorporated");
    //                     vulns.then((vulnInfo) =>{
    //                         AllVulns.push(...vulnInfo);
    //                         console.log("AllVulns", AllVulns);
    //                     }).finally(() => {
    //                         console.log("finally allVulns", AllVulns);
    //                     });
    //                     ReposVisited.push(Repo.ID);
    //                 }  
    //             }
    //         }).finally(() => {
    //             console.log("finally allVulns 2", AllVulns);
    //         });
    //     }
        
    // }).finally (() => {
    //     const test = sortVulnData(AllVulns);
    //     console.log("test", test);
    // });

    
};
