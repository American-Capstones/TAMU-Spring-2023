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

import { sortVulnData } from '../utils/functions';

import {
  VulnInfoUnformatted,
} from '../utils/types';
import { getVulnsFromRepo } from './getVulnsFromRepo';
import { getReposForTeam } from './getReposForTeam';
import { getTeamsForOrg } from './getTeamsForOrg';
import { InputError } from '@backstage/errors'
import { githubAuthApiRef, useApi } from '@backstage/core-plugin-api';

export const useGetSeverityCountsForOrg = async (
    orgLogin: string,
    teamLimit: number, 
    repoLimit: number,
    ) => {
    const AllVulns: VulnInfoUnformatted[] = [];   
    const ReposVisited: string[] = [];
    
    const auth = useApi(githubAuthApiRef)
    let TeamsInOrg = await getTeamsForOrg(auth, orgLogin);

    for (var Team of TeamsInOrg) {
        let ReposForTeams = await getReposForTeam(auth, orgLogin, Team.name);

        for (var Repo of ReposForTeams) {
            if (!ReposVisited.includes(Repo.ID)){
                let vulns = await getVulnsFromRepo(auth, Repo.name, orgLogin);
                
                for (var vulnInfo of vulns) {
                    AllVulns.push(vulnInfo);
                }

                ReposVisited.push(Repo.ID);
            }  
        }
    }
    const sortedVulnData = sortVulnData(AllVulns);
};
