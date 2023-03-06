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

export type Connection<T> = {
  nodes: T;
  pageInfo: {
    hasNextPage: boolean;
    endCursor?: string;
  };
};
 
export type Repository = {
  name: string;
}

export type Repositories<T> = {
  user: {
    repositories: Connection<T>;
  };
};

export type RepoName = {
  name: string;
};

export type VulnInfoRepo<T> = {
  repository : {
    name:string;
    url:string;
    vulnerabilityAlerts : {
      nodes : T
    }
  }
}
export type VulnInfoUnformatted = {
  createdAt : string;
  dismissedAt : string;
  fixedAt : string;
  securityAdvisory : {
    summary : string;
    severity : string;
    classification : string;
    vulnerabilities : {
      totalCount : number
    }
  }
  securityVulnerability : {
    package : {
      name : string
    }
    vulnerableVersionRange : string;
    firstPatchedVersion : {
      identifier : string
    }
  }
  state : string
}

export type VulnInfoFormatted = {
  packageName: string;
  versionNum: string;
  createdAt: string; 
  pullRequest: string;
  dismissedAt: string;
  fixedAt: string;
  vulnVersionRange: string,
  classification: string;
  severity: string;
  summary: string;
  vulnerabilityCount: number;
  state: string;
  /*
  url: string
  number: number
  vulnerableManifestPath: string // which file the vuln is in
  pullRequestNum: number;
  pullRequestLink: string;
  ecosystem: string
  */
};

export type RepoVulns = {
  critical: VulnInfoFormatted[];
  high: VulnInfoFormatted[];
  moderate: VulnInfoFormatted[];
  low: VulnInfoFormatted[];
}