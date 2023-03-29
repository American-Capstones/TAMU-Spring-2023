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
import {
  Teams, 
  Team,
} from '../utils/types';
import { GITHUB_GRAPHQL_MAX_ITEMS, GITHUB_TEAM_MAX_ITEMS } from '../utils/constants';
import { VulnInfoUnformatted } from '../utils/types';
import { getReposForTeam } from "./getReposForTeam";
import { getVulnsFromRepo } from "./getVulnsFromRepo";
import { countVulnData } from '../utils/functions';



export const getTeamsForOrg = (graphql:any,  orgLogin: string) => {
  let teams =  getTeamNodes(graphql, orgLogin, GITHUB_TEAM_MAX_ITEMS);
  return teams;
};

export async function getTeamNodes(graphql:any, orgLogin: string, teamLimit: number, getAll: boolean = false): Promise<Team[]> {
  const teamNodes: Team[] = [];
  let result:
    | Teams<Team[]>
    | undefined = undefined;

  do {
    result = await graphql(
      `
      query ($login: String!, $first: Int, $endCursor: String){ 
        organization(login: $login) {
          teams(first:$first, after: $endCursor){
              pageInfo {hasNextPage, endCursor}
              nodes {
                name
            }
          }
        }
      }
      `,
      {
        login: orgLogin,
        first:
          teamLimit > GITHUB_GRAPHQL_MAX_ITEMS
            ? GITHUB_GRAPHQL_MAX_ITEMS
            : teamLimit,
        endCursor: result
          ? result.organization.teams.pageInfo.endCursor
          : undefined,
      },
    );
    
    if(result) {
      if (!result.organization){
        break
      }
      teamNodes.push(
        ...result.organization.teams.nodes
      );
    }

    if (teamNodes.length >= teamLimit && !getAll) return teamNodes;
  } while (result?.organization.teams.pageInfo.hasNextPage);

  return teamNodes;
}
