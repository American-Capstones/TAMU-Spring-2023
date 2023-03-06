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
  RepoName,
} from '../utils/types';
import { useOctokitGraphQl } from './useOctokitGraphQl';

const GITHUB_GRAPHQL_MAX_ITEMS = 100;

export async function getVulnerabilitiesFromUser(
  userLogin: string
): Promise<RepoName[]> {
  const repoRequestLimit = 10
  const graphql =
    useOctokitGraphQl<Repositories<RepoName[]>>();
  const repoRequestNodes: RepoName[] = [];
  let result:
    | Repositories<RepoName[]>
    | undefined = undefined;

  do {
    result = await graphql(
      `
      query ($login: String!, $first: Int, $endCursor: String){ 
        user(login: $login) {
          repositories(first: $first, orderBy: {field:NAME, direction:ASC}, after: $endCursor){
            pageInfo {hasNextPage, endCursor}
            nodes {
              name
              url
              vulnerabilityAlerts(first: $first) {
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
      }
      `,
      {
        login: userLogin,
        first:
          repoRequestLimit > GITHUB_GRAPHQL_MAX_ITEMS
            ? GITHUB_GRAPHQL_MAX_ITEMS
            : repoRequestLimit,
        endCursor: result
          ? result.user.repositories.pageInfo.endCursor
          : undefined,
      },
    );

    repoRequestNodes.push(
      ...result.user.repositories.nodes
    );

    if (repoRequestNodes.length >= repoRequestLimit) return repoRequestNodes;
  } while (result.user.repositories.pageInfo.hasNextPage);

  return repoRequestNodes;
}
