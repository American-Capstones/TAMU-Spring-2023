
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
};

export type VulnListProps = {
    vulns: VulnInfo[];
}