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
import React from 'react';

import {
  Teams, 
  Team,
} from '../utils/types';
import { useOctokitGraphQl } from './useOctokitGraphQl';

const TEAM_REQUEST_LIMIT = 10;
const GITHUB_GRAPHQL_MAX_ITEMS = 100;

export const useGetTeamsForOrg = () => {
  const graphql =
    useOctokitGraphQl<Teams<Team[]>>();

  //this doesnt work
//   const fn = React.useRef(
//     async (
//       userLogin: string,
//       teamLimit?: number,
//     ): Promise<Team[]> => {
//       const limit = teamLimit ?? TEAM_REQUEST_LIMIT;

//       return await getTeamNodes(graphql, userLogin, limit);
//     },
//   );
  //

  return getTeamNodes(graphql, "baggage-claim-incorporated", 10);

//   return fn.current;
};

async function getTeamNodes(
  graphql: (
    path: string,
    options?: any,
  ) => Promise<Teams<Team[]>>,
  orgLogin: string,
  teamLimit: number,
): Promise<Team[]> {
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

    teamNodes.push(
      ...result.organization.teams.nodes
    );

    if (teamNodes.length >= teamLimit) return teamNodes;
  } while (result.organization.teams.pageInfo.hasNextPage);

  console.log("TEAMNODES");
  console.log(teamNodes);

  return teamNodes;
}