
export type RepoVulns {
    critical: VulnInfo[];
    high: VulnInfo[];
    moderate: VulnInfo[];
    low: VulnInfo[];
}

export type VulnInfo = {
    packageName: string;
    versionNum: number;
    createdAt: string; 
    pullRequest: string;
    dismissedAt: string;
    fixedAt: string;
    vulnVersionRange: string,
    classification: string;
    severity: string;
    summary: string;
    vulnerabilityCount: object;
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

export type VulnListProps = {
    vulns: VulnInfo[];
}