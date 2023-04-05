import { Org, Team, vulnData } from "./types";

export const GITHUB_GRAPHQL_MAX_ITEMS = 100;
export const GITHUB_ORG_MAX_ITEMS = 10;
export const GITHUB_TEAM_MAX_ITEMS = 10;
export const GITHUB_REPO_MAX_ITEMS = 10;
export const GITHUB_VULNS_MAX_ITEMS = 10;

export const EMPTY_ORG:Org = {
    name: '',
    vulnData: {
        startMonth: undefined,
        critical: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        high: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        moderate: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        low: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        criticalNum: 0,
        highNum: 0,
        moderateNum: 0,
        lowNum: 0,
    },
    teams: [],
    repos: [],
    topics: [],
    url: '',
    avatarUrl: '',
}

export const EMPTY_TEAM:Team = {
    name: '',
    vulnData: {
        startMonth: undefined,
        critical: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        high: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        moderate: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        low: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        criticalNum: 0,
        highNum: 0,
        moderateNum: 0,
        lowNum: 0,
    },
    repos: [],
    offenses: 0
}

export const EMPTY_VULNDATA:vulnData =  {
    startMonth: undefined,
    critical: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    high: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    moderate: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    low: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    criticalNum: 0,
    highNum: 0,
    moderateNum: 0,
    lowNum: 0,
}