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

import { useGetRepositoriesForTeam } from './useGetRepositoriesForTeam';
import { useGetTeamsForOrg } from './useGetTeamsForOrg';

export const useGetSeverityCountsForOrg = (
) => {
        let TeamsInOrg = useGetTeamsForOrg("baggage-claim-incorporated", 10);
        useGetRepositoriesForTeam("baggage-claim-incorporated", "Team A", 10);

        // because TeamsInOrg is wrapped in a Promise
        TeamsInOrg.then((Teams) => {
            for (var Team of Teams){
                console.log("team ", Team );
                // get the repositories
                // useGetRepositoriesForTeam("baggage-claim-incorporated", Team.name, 10); says invalid use of hook here?.
                // use the repository names (and maybe the org name) to get the VulnerabilityAlerts
            }
        });
        
    }