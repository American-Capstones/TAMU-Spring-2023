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

import { Org, Orgs, Error } from '../utils/types';
import { GITHUB_GRAPHQL_MAX_ITEMS, GITHUB_ORG_MAX_ITEMS } from '../utils/constants';

export const getOrgsForUser = (graphql:any) => {
    return getOrgNodes(graphql, GITHUB_ORG_MAX_ITEMS);
};

export async function getOrgNodes(graphql:any, organizationLimit: number): Promise<{"orgNodes": Org[], "error": Error}> {
    const orgNodes: Org[] = [];
    let error:
        | Error
        | undefined = undefined;
    let result:
        | Orgs<Org[]>
        | undefined = undefined;

    do {
        result = await graphql(
        `
        query($first: Int, $endCursor: String){
            viewer {
              organizations(first:$first, after: $endCursor) {
                pageInfo {hasNextPage, endCursor}
                nodes {
                  name
                  url
                  avatarUrl
                }
              }
            }
          }
        `,
        {
            first:
            organizationLimit > GITHUB_GRAPHQL_MAX_ITEMS
                ? GITHUB_GRAPHQL_MAX_ITEMS
                : organizationLimit,
            endCursor: result
            ? result.viewer.organizations.pageInfo.endCursor
            : undefined,
        },
        );

        if(result){
            // result.viewer will be null if there is an error
            if (!result.viewer){
                if (result.errors){
                    error = result.errors[0]
                }
                break
            }
            orgNodes.push(
                ...result.viewer.organizations.nodes
            );
        }

        if (orgNodes.length >= organizationLimit) return {orgNodes, error};
    } while (result?.viewer.organizations.pageInfo.hasNextPage);

    return {orgNodes, error};
}
