import { Org } from "./types";

export const GITHUB_GRAPHQL_MAX_ITEMS = 100;
export const GITHUB_ORG_MAX_ITEMS = 10;
export const GITHUB_TEAM_MAX_ITEMS = 10;
export const GITHUB_REPO_MAX_ITEMS = 10;
export const GITHUB_VULNS_MAX_ITEMS = 10;
export const emptyOrg:Org = {
    name: '',
    vulnData: {
        startMonth: undefined,
        critical: [],
        high: [],
        moderate: [],
        low: [],
        criticalNum: 0,
        highNum: 0,
        moderateNum: 0,
        lowNum: 0,
    },
    teams: []
}