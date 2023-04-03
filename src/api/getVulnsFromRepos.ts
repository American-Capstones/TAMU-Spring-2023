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

// not using this currently, thought that it could improve performance but there are other issues with this approach
import {
    VulnInfoRepo,
    VulnInfoUnformatted
  } from '../utils/types';
  import { GITHUB_GRAPHQL_MAX_ITEMS, GITHUB_VULNS_MAX_ITEMS } from '../utils/constants';
  
  export const getVulnsFromRepos = (graphql: any, ids: string[], orgLogin: string, getAll: boolean) => {  
      return getVulnerabilityNodes(graphql, ids, orgLogin, getAll);
  };
  
  export async function getVulnerabilityNodes(
    graphql: (
      path: string,
      options?: any,
    ) => Promise<VulnInfoRepo<VulnInfoUnformatted[]>>,
    ids: string[],
    owner: string,
    getAll: boolean = false
  ): Promise<VulnInfoUnformatted[]> {
    const repoRequestLimit = GITHUB_VULNS_MAX_ITEMS
    const vulnerabilityData : VulnInfoUnformatted[] = [];
    let result:
      | VulnInfoRepo<VulnInfoUnformatted[]>
      | undefined = undefined;
    do{
      result = await graphql(
        `
        query ($ids: [ID!]!, $first: Int, $endCursor: String){
            nodes(ids: $ids) {
                ... on Repository {
                  name
                  vulnerabilityAlerts(first: $first, after: $endCursor) {
                      pageInfo {hasNextPage, endCursor}
                      nodes {
                        createdAt
                        dismissedAt
                        fixedAt
                        securityAdvisory {
                          summary
                          severity
                          classification
                          vulnerabilities {
                            totalCount
                          }
                        }
                        securityVulnerability {
                            package {
                              name
                            }
                            firstPatchedVersion {
                              identifier
                            }
                            vulnerableVersionRange
                          }
                          state
                      }
                  }
                }
              }
            }
        `,
        {
          ids: ids,
          owner: owner,
          first:
            repoRequestLimit > GITHUB_GRAPHQL_MAX_ITEMS
              ? GITHUB_GRAPHQL_MAX_ITEMS
              : repoRequestLimit,
          endCursor: result
          ? result.nodes[0].vulnerabilityAlerts.pageInfo.endCursor
          : undefined,
        },
      );
      if(result){
        console.log(result)
        // if(!result.repository || !result.repository.vulnerabilityAlerts){
        //   break
        // }
        for (var n of result.nodes){
            vulnerabilityData.push(...n.vulnerabilityAlerts.nodes)            
        }
      }
      
      if (vulnerabilityData.length >= repoRequestLimit && !getAll) return vulnerabilityData;
    } while(result?.nodes[0].vulnerabilityAlerts.pageInfo.hasNextPage)
  
    return vulnerabilityData;
  }
  