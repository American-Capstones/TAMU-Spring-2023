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
    GITHUB_GRAPHQL_MAX_ITEMS,
    GITHUB_REPO_MAX_ITEMS 
  } from '../utils/constants';
import {Repositories, Repository,} from '../utils/types';
import {formatRepoNodes,} from '../utils/functions';

  export const getReposForOrg = (
    graphql: any,
    orgLogin: string,
    ) => {
    return getRepoNodes(graphql, orgLogin, GITHUB_REPO_MAX_ITEMS);;
  };
  
  export async function getRepoNodes (
      graphql: any,
      orgLogin: string,
      repoLimit: number,
      getAll: boolean = false,
    ): Promise<Repository[]> { 
    const repoNodes: Repository[] = [];
    let result:
      | Repositories
      | undefined = undefined;
  
    do {
        result = await graphql(
            `
            query($login: String!, $first: Int, $endCursor: String){
                organization(login: $login) {
                    repositories(first:$first, after: $endCursor) {
                    pageInfo {hasNextPage, endCursor}
                    nodes {
                        name
                        id
                        repositoryTopics(first:100) {
                        edges {
                            node {
                            id
                            topic {
                                name
                                }
                            }
                        }
                        }            
                    }  
                } 
                }
            }      
            `,
            {
                login: orgLogin,
                first:
                repoLimit > GITHUB_GRAPHQL_MAX_ITEMS
                    ? GITHUB_GRAPHQL_MAX_ITEMS
                    : repoLimit,
                endCursor: result
                ? result.organization.repositories.pageInfo.endCursor
                : undefined,
            },
        );
      if(result) {
        if (result.organization){
          repoNodes.push(
            ...formatRepoNodes(result.organization.repositories.nodes)
          );
        } 
      }
      if (repoNodes.length >= repoLimit && !getAll) return repoNodes;
    } while (result?.organization?.repositories.pageInfo.hasNextPage);
  
    return repoNodes;
  }