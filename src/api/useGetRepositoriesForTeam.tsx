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
  Repositories, 
  Repository,
} from '../utils/types';
import { useOctokitGraphQl } from './useOctokitGraphQl';

const REPO_REQUEST_LIMIT = 10;
const GITHUB_GRAPHQL_MAX_ITEMS = 100;

export const useGetRepositoriesForTeam = () => {
  const graphql =
    useOctokitGraphQl<Repositories<Repository[]>>();

  //this doesnt work
  const fn = React.useRef(
    async (
      userLogin: string,
      teamLimit?: number,
    ): Promise<Repository[]> => {
      const limit = teamLimit ?? REPO_REQUEST_LIMIT;

      return await getRepoNodes(graphql, userLogin, "TeamA", limit);
    },
  );
  //

  getRepoNodes(graphql, "baggage-claim-incorporated", "Team A", 10);

  return fn.current;
};

async function getRepoNodes(
  graphql: (
    path: string,
    options?: any,
  ) => Promise<Repositories<Repository[]>>,
  orgLogin: string,
  teamLogin: string,
  repoLimit: number,
): Promise<Repository[]> {
  const repoNodes: Repository[] = [];
  let result:
    | Repositories<Repository[]>
    | undefined = undefined;

  do {
    result = await graphql(
      `
        query($login: String!, $teamLogin: String!, $first: Int, $endCursor: String){
            organization(login: $login){
                teams(query: $teamLogin, first:$first, after: $endCursor) {
                     pageInfo {hasNextPage, endCursor}
                     nodes {
                       repositories(first:10){
                         nodes{
                           name
                         }
                       }
                    }  
                } 
            }
        }      
      `,
      {
        login: orgLogin,
        teamLogin: teamLogin,
        first:
          repoLimit > GITHUB_GRAPHQL_MAX_ITEMS
            ? GITHUB_GRAPHQL_MAX_ITEMS
            : repoLimit,
        endCursor: result
          ? result.organization.teams.pageInfo.endCursor
          : undefined,
      },
    );

    repoNodes.push(
      ...result.organization.teams.nodes
    );

    if (repoNodes.length >= repoLimit) return repoNodes;
  } while (result.organization.teams.pageInfo.hasNextPage);

  console.log("REPONODES");
  console.log(repoNodes);

  return repoNodes;
}