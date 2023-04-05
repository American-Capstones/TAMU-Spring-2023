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

import { TableColumn, TableFilter } from "@backstage/core-components";

export type Connection<T> = {
  nodes: T;
  pageInfo: {
    hasNextPage: boolean;
    endCursor?: string;
  };
};

export type Repositories = {
  organization: {
    teams: {
      nodes: RepositoryNode[];
    }
  }
}

export type RepositoryNode = {
  repositories: Connection<Repository[]>;
}

export type Node = {
    node: {
        id: string;
        topic: {
            name: string;
        }
    }
}

export type RepositoryUnformatted = {
    id: string;
    name: string;
    repositoryTopics: {
        edges: Node[];
    }
}

export type Repository = {
  id: string;
  name: string;
  low: number;
  moderate: number;
  high: number;
  critical: number;
  repositoryTopics: string[];
}


export type RepoName = {
  name: string;
};

export type Teams<T> = {
  organization: {
    teams: Connection<T>;
  };
}

export type Team = {
  name: string;
  vulnData: vulnData,
  offenses: number,
  repos: Repository[]
}

export type TeamNode = {
  name: string
}

export type VulnInfoRepo<T> = {
  repository : {
    name:string;
    url:string;
    vulnerabilityAlerts: Connection<T>
    // vulnerabilityAlerts : {
    //   nodes : T
    // }
  }
}
export type VulnInfoUnformatted = {
  createdAt : string;
  dismissedAt : string;
  fixedAt : string;
  number: number;
  dependabotUpdate:{
    pullRequest: {
      number: number,
      permalink: string
    }
  }
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
  state : string;
  url: string;
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
  url: string;
};

export type RepoVulns = {
  critical: VulnInfoFormatted[];
  high: VulnInfoFormatted[];
  moderate: VulnInfoFormatted[];
  low: VulnInfoFormatted[];
}

export type VulnListProps = {
    vulns: VulnInfoFormatted[] | undefined;
}

export type Orgs <T> = {
  viewer:{
    organizations:Connection<T>;
  }
}

export type Org = {
  name: string;
  vulnData: vulnData,
  teams: Team[],
  repos: Repository[],
  topics: Topic[]
  url: string;
  avatarUrl: string;
}

export type Error = {
  message: string;
  type: string;
  path: [string];
  locations: [
    {
      "line": number,
      "column": number
    }
  ]
}

export type Severity = {
   severity: string,
   count: number
}

export type vulnData = {
  startMonth: number | undefined,
  critical: number[],
  high: number[],
  moderate: number[],
  low: number[],
  criticalNum: number,
  highNum: number,
  moderateNum: number,
  lowNum: number
}

export type TableProps = {
    columns: TableColumn[],
    rows: any[],
    filters: TableFilter[],
    title: string,
    onRowClick: (event: React.MouseEvent | undefined, rowData: any) => void,
    emptyContent: React.ReactNode
};

export type Coords = {
    x: string,
    y: number
}

export type LineGraphData = {
    id: string,
    color?: string, // in the format hsl(num, %, %)
    data: Coords[]
}

export type BarGraphData = {
    severity: string,
    count: number
}

export type GraphsProps = {
    lineData: LineGraphData[],
    barData: BarGraphData[],
    isLoading?: boolean
}

export type monthVulns = {
  critical: number[];
  high: number[];
  moderate: number[];
  low: number[];
}

export type Topic = {
  name: string;
  vulnData: vulnData,
  repos: Repository[]
}
