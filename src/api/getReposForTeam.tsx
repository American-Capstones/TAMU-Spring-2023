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
import { GITHUB_GRAPHQL_MAX_ITEMS, GITHUB_REPO_MAX_ITEMS } from '../utils/constants';
import { Repositories, Repository } from '../utils/types';

import { formatRepoNodes } from '../utils/functions';

export const getReposForTeam = (graphql: any, orgLogin: string, teamLogin: string) => {
  return getRepoNodes(graphql, orgLogin, teamLogin, GITHUB_REPO_MAX_ITEMS);
};

export async function getRepoNodes(
  graphql: any,
  orgLogin: string,
  teamLogin: string,
  repoLimit: number,
  getAll: boolean = false,
): Promise<Repository[]> {
  const repoNodes: Repository[] = [];
  let result: Repositories | undefined = undefined;

  do {
    result = await graphql(
      `
        query ($login: String!, $teamLogin: String!, $first: Int, $endCursor: String) {
          organization(login: $login) {
            teams(query: $teamLogin, first: 1) {
              nodes {
                repositories(first: $first, after: $endCursor) {
                  pageInfo {
                    hasNextPage
                    endCursor
                  }
                  nodes {
                    name
                    id
                    repositoryTopics(first: 100) {
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
          }
        }
      `,
      {
        login: orgLogin,
        teamLogin: teamLogin,
        first: repoLimit > GITHUB_GRAPHQL_MAX_ITEMS ? GITHUB_GRAPHQL_MAX_ITEMS : repoLimit,
        endCursor: result ? result.organization.teams.nodes[0].repositories.pageInfo.endCursor : undefined,
      },
    );
    if (result) {
      if (result.organization) {
        if (result.organization.teams.nodes.length == 0) {
          break;
        }
        repoNodes.push(...formatRepoNodes(result.organization.teams.nodes[0].repositories.nodes));
      }
    }
    if (repoNodes.length >= repoLimit && !getAll) return repoNodes;
  } while (result?.organization?.teams.nodes[0].repositories.pageInfo.hasNextPage);

  return repoNodes;
}
