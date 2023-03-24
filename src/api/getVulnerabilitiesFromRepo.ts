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
  VulnInfoRepo,
  VulnInfoUnformatted
} from '../utils/types';
import { useOctokitGraphQl } from './useOctokitGraphQl';
import { InputError } from '@backstage/errors'
import { GITHUB_GRAPHQL_MAX_ITEMS, GITHUB_VULN_MAX_ITEMS } from '../utils/constants';


export const getVulnerabilitiesFromRepo = (
    repoName: string,
    orgLogin: string,
  ) => {
    if (orgLogin == "" || !orgLogin){
      throw new InputError("Invalid orgLogin");
    }
  
    if (repoName == "" || !repoName){
        throw new InputError("Invalid orgLogin");
      }
  
    const graphql = useOctokitGraphQl<VulnInfoRepo<VulnInfoUnformatted[]>>();
  
    return getVulnerabilityNodes(graphql, repoName, orgLogin);
  
  };

export async function getVulnerabilityNodes(
  graphql: (
    path: string,
    options?: any,
  ) => Promise<VulnInfoRepo<VulnInfoUnformatted[]>>,
  name: string,
  owner: string
): Promise<VulnInfoUnformatted[]> {
  const repoRequestLimit = GITHUB_VULN_MAX_ITEMS
  const vulnerabilityData : VulnInfoUnformatted[] = [];
  let result:
    | VulnInfoRepo<VulnInfoUnformatted[]>
    | undefined = undefined;
  do{
    result = await graphql(
      `
      query ($name: String!, $owner:String!, $first: Int, $endCursor: String){
        repository(name: $name, owner: $owner){
          name
          url
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
      `,
      {
        name: name,
        owner: owner,
        first:
          repoRequestLimit > GITHUB_GRAPHQL_MAX_ITEMS
            ? GITHUB_GRAPHQL_MAX_ITEMS
            : repoRequestLimit,
        endCursor: result
        ? result.repository.vulnerabilityAlerts.pageInfo.endCursor
        : undefined,
      },
    );
    if(result){
      if(!result.repository || !result.repository.vulnerabilityAlerts){
        break
      }
      vulnerabilityData.push(...result.repository.vulnerabilityAlerts.nodes)
    }

    if (vulnerabilityData.length >= repoRequestLimit) return vulnerabilityData;
  } while(result?.repository.vulnerabilityAlerts.pageInfo.hasNextPage)

  return vulnerabilityData;
}
