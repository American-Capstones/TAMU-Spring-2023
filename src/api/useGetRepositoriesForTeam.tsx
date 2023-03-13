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
    Repositories, 
    Repository,
  } from '../utils/types';
  import { useOctokitGraphQl } from './useOctokitGraphQl';
  import { InputError } from '@backstage/errors'
  
  const GITHUB_GRAPHQL_MAX_ITEMS = 100;
  
  export const useGetRepositoriesForTeam = (
      orgLogin: string,
      teamLogin: string,
      repoLimit: number,
      ) => {
  
      if (orgLogin == "" || !orgLogin){
          throw new InputError("Invalid orgLogin");
      }
  
      if (teamLogin == "" || !teamLogin){
          throw new InputError("Invalid teamLogin");
      }
          
      if (repoLimit <= 0 || repoLimit >= 100 || !repoLimit){
          throw new InputError("Invalid repoLimit");
      }
  
      const graphql = useOctokitGraphQl<Repositories>();
  
      return getRepoNodes(graphql, orgLogin, teamLogin, repoLimit);;
  
  };
  
  async function getRepoNodes (
      graphql: (
          path: string,
          options?: any,
        ) => Promise<Repositories>,
      orgLogin: string,
      teamLogin: string,
      repoLimit: number,
      ): Promise<Repository[]> { 
      const repoNodes: Repository[] = [];
    let result:
      | Repositories
      | undefined = undefined;
  
      do {
          result = await graphql(
              `
              query($login: String!, $teamLogin: String!, $first: Int, $endCursor: String){
                  organization(login: $login){
                      teams(query: $teamLogin, first:1) {
                          nodes {
                          repositories(first:$first, after: $endCursor){
                              pageInfo {hasNextPage, endCursor}
                              nodes{
                              name
                              id
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
              ? result.organization.teams.nodes[0].repositories.pageInfo.endCursor
              : undefined,
          },
      );
  
      repoNodes.push(
        ...result.organization.teams.nodes[0].repositories.nodes
      );
  
      if (repoNodes.length >= repoLimit) return repoNodes;
    } while (result.organization.teams.nodes[0].repositories.pageInfo.hasNextPage);
  
    return repoNodes;
  }