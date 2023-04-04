import { getTeamsForOrg } from "../getTeamsForOrg";
import { getAllRawData } from "../getAllData";
import { getReposForTeam } from "../getReposForTeam";
import { getVulnsFromRepo } from "../getVulnsFromRepo";
import { formatVulnData } from "../../utils/functions";


jest.mock('../getTeamsForOrg', () => ({
    ...jest.requireActual('../getTeamsForOrg'),
    getTeamsForOrg: jest.fn(),
}));

jest.mock('../getReposForTeam', () => ({
    ...jest.requireActual('../getReposForTeam'),
    getReposForTeam: jest.fn()
}));

jest.mock('../getVulnsFromRepo', () => ({
    ...jest.requireActual('../getVulnsFromRepo'),
    getVulnsFromRepo: jest.fn(),
}));

jest.mock('../../utils/functions', () => ({
    ...jest.requireActual('../../utils/functions'),
    formatVulnData: jest.fn(),
}));


describe("getAllRawData Test Suite", () => {
    test("Should return a valid object when given all valid inputs", async () => {
        getTeamsForOrg.mockImplementation(() => [{
            name: "team1", 
        }])
        getReposForTeam.mockImplementation(() => [{
            name: "repo1", 
            id: "abc", 
            low: 0, 
            moderate: 0, 
            high: 0, 
            critical: 0,
            repositoryTopics: ["topic1", "topic2"]
        }])
        getVulnsFromRepo.mockImplementation(() => ["vuln1", "vuln2", "vuln3"])
        const mockedGraphQl = jest.fn().mock
        formatVulnData.mockImplementationOnce(() => 
            ([
                {
                    packageName: "package1",
                    versionNum: ">= 1.0.0, < 1.4.2",
                    createdAt: "2023-03-01T18:38:55Z",
                    pullRequest: {
                        number: 3,
                        permalink: "link"
                    },
                    dismissedAt: null,
                    fixedAt: null,
                    vulnVersionRange: "1.4.2",
                    classification: "GENERAL",
                    severity: "CRITICAL",
                    summary: "loader-utils is vulnerable to Regular Expression Denial of Service (ReDoS) via url variable",
                    vulnerabilityCount: 3,
                    state: "OPEN",
                    url: "link"
                },
                {
                    packageName: "package2",
                    versionNum: ">= 1.0.0, < 1.4.2",
                    createdAt: "2023-03-01T18:38:55Z",
                    pullRequest: {
                        number: 3,
                        permalink: "link"
                    },
                    dismissedAt: null,
                    fixedAt: null,
                    vulnVersionRange: "1.4.2",
                    classification: "GENERAL",
                    severity: "HIGH",
                    summary: "loader-utils is vulnerable to Regular Expression Denial of Service (ReDoS) via url variable",
                    vulnerabilityCount: 3,
                    state: "OPEN",
                    url: "https://github.com/Baggage-Claim-Incorporated/prolog-app/security/dependabot/9"
                },
                {
                    packageName: "package3",
                    versionNum: ">= 1.0.0, < 1.4.2",
                    createdAt: "2023-03-01T18:38:55Z",
                    pullRequest: {
                        number: 3,
                        permalink: "link"
                    },
                    dismissedAt: null,
                    fixedAt: null,
                    vulnVersionRange: "1.4.2",
                    classification: "GENERAL",
                    severity: "MODERATE",
                    summary: "loader-utils is vulnerable to Regular Expression Denial of Service (ReDoS) via url variable",
                    vulnerabilityCount: 3,
                    state: "OPEN",
                    url: "link"
                },
                {
                    packageName: "package3",
                    versionNum: ">= 1.0.0, < 1.4.2",
                    createdAt: "2023-03-01T18:38:55Z",
                    pullRequest: {
                        number: 3,
                        permalink: "link"
                    },
                    dismissedAt: null,
                    fixedAt: null,
                    vulnVersionRange: "1.4.2",
                    classification: "GENERAL",
                    severity: "LOW",
                    summary: "loader-utils is vulnerable to Regular Expression Denial of Service (ReDoS) via url variable",
                    vulnerabilityCount: 3,
                    state: "OPEN",
                    url: "link"
                }
            ])
        )
        const OrgData = await getAllRawData(mockedGraphQl, "goodOrg");
        console.log("orgData", OrgData);
        expect(OrgData).toEqual(
            {
                name: "goodOrg", 
                vulnData: {
                    critical: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    criticalNum: 1, 
                    high: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    highNum: 1, 
                    low: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    lowNum: 1,
                    moderate: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    moderateNum: 1, 
                    startMonth: new Date().getMonth() + 1,
                },
                repos: [
                    {
                        name: "repo1",
                        critical: 1, 
                        high: 1,
                        low: 1, 
                        moderate: 1, 
                        id: "abc",
                        repositoryTopics: ["topic1", "topic2"], 
                    }
                ],
                teams: [
                {
                    name: "team1",
                    vulnData: {
                        critical: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        criticalNum: 1, 
                        high: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        highNum: 1, 
                        moderate: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        moderateNum: 1, 
                        low: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        lowNum: 1, 
                        startMonth: new Date().getMonth() + 1,
                    },
                    repos:[
                        {
                            name: "repo1",
                            critical: 1, 
                            high: 1, 
                            moderate: 1, 
                            low: 1,
                            id: "abc", 
                            repositoryTopics: ["topic1", "topic2"]
                        }
                    ]
                }
                ],
                topics: [
                    {
                        name: "topic1",
                        vulnData: {
                            critical: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            criticalNum: 1, 
                            high: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            highNum: 1, 
                            moderate: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            moderateNum: 1, 
                            low: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            lowNum: 1, 
                            startMonth: new Date().getMonth() + 1,
                        },
                        repos: [
                            {
                                name: "repo1",
                                critical: 1, 
                                high: 1,
                                low: 1, 
                                moderate: 1, 
                                id: "abc",
                                repositoryTopics: ["topic1", "topic2"], 
                            }
                        ]
                    },
                    {
                        name: "topic2",
                        vulnData: {
                            critical: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            criticalNum: 1, 
                            high: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            highNum: 1, 
                            moderate: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            moderateNum: 1, 
                            low: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            lowNum: 1, 
                            startMonth: new Date().getMonth() + 1,
                        },
                        repos: [
                            {
                                name: "repo1",
                                critical: 1, 
                                high: 1,
                                low: 1, 
                                moderate: 1, 
                                id: "abc",
                                repositoryTopics: ["topic1", "topic2"], 
                            }
                        ]
                    }
                ]
            }
        );
    }); 
});
