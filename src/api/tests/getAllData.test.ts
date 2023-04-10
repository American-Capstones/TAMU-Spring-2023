import { formatVulnData } from "../../utils/functions";
import { getVulnDataForRepos } from "../getAllData";
import {Topic} from "../../utils/functions";
import { EMPTY_ORG, EMPTY_TEAM, EMPTY_VULNDATA } from "../../utils/constants";
jest.mock('../getVulnsFromRepo', () => ({
    ...jest.requireActual('../getVulnsFromRepo'),
    getVulnsFromRepo: jest.fn(),
}));

jest.mock('../../utils/functions', () => ({
    ...jest.requireActual('../../utils/functions'),
    formatVulnData: jest.fn(),
}));


jest.mock('../getReposForOrg', () => ({
    ...jest.requireActual('../getReposForOrg'),
    getReposForOrg: jest.fn(),
}));

const mockedGraphQl = jest.fn().mock


describe ("getVulnDataForRepos Test Suite", () => {
    test("Should return a valid objects when given all valid inputs (all vulns open)" , async () =>{

        formatVulnData.mockImplementationOnce((arg1) =>
            [
                {
                    "packageName": "trim",
                    "versionNum": "< 0.0.3",
                    "createdAt": "2023-03-01T18:38:53Z",
                    "dismissedAt": null,
                    "fixedAt": null,
                    "vulnVersionRange": "0.0.3",
                    "classification": "GENERAL",
                    "severity": "HIGH",
                    "summary": "Regular Expression Denial of Service in trim",
                    "vulnerabilityCount": 1,
                    "state": "OPEN",
                    "url": "url"
                },
                {
                    "packageName": "glob-parent",
                    "versionNum": "< 5.1.2",
                    "createdAt": "2023-03-01T18:38:54Z",
                    "dismissedAt": null,
                    "fixedAt": null,
                    "vulnVersionRange": "5.1.2",
                    "classification": "GENERAL",
                    "severity": "HIGH",
                    "summary": "glob-parent before 5.1.2 vulnerable to Regular Expression Denial of Service in enclosure regex",
                    "vulnerabilityCount": 1,
                    "state": "OPEN",
                    "url": "url"
                },
            ])
        formatVulnData.mockImplementationOnce((arg1) =>
        [
            {
                "packageName": "trim",
                "versionNum": "< 0.0.3",
                "createdAt": "2023-03-01T18:38:53Z",
                "dismissedAt": null,
                "fixedAt": null,
                "vulnVersionRange": "0.0.3",
                "classification": "GENERAL",
                "severity": "LOW",
                "summary": "Regular Expression Denial of Service in trim",
                "vulnerabilityCount": 1,
                "state": "OPEN",
                "url": "url"
            }
        ])

        const newRepos = [{
            name: "repo1", 
            id: "abc", 
            low: 0, 
            moderate: 0, 
            high: 0, 
            critical: 0,
            repositoryTopics: ["topic1", "topic2"]
        },
        {
            name: "repo2", 
            id: "abd", 
            low: 0, 
            moderate: 0, 
            high: 0, 
            critical: 0,
            repositoryTopics: ["topic3"]
        }]

        
        const teamData = EMPTY_TEAM
        teamData.vulnData.startMonth = new Date().getMonth();

        const orgData = EMPTY_ORG
        orgData.name = "goodOrg";
        orgData.vulnData.startMonth = new Date().getMonth();

        const result = await getVulnDataForRepos(mockedGraphQl, "goodOrg", newRepos, teamData, orgData, new Set<string>, new Map<string, Topic>);
        
        const resultRepos = [{
            name: "repo1", 
            id: "abc", 
            low: 0, 
            moderate: 0, 
            high: 2, 
            critical: 0,
            repositoryTopics: ["topic1", "topic2"]
        },
        {
            name: "repo2", 
            id: "abd", 
            low: 1, 
            moderate: 0, 
            high: 0, 
            critical: 0,
            repositoryTopics: ["topic3"]
        }]

        const vulnData = {
            startMonth: new Date().getMonth(),
            critical: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            high: [0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
            moderate: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            low: [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            criticalNum: 0,
            highNum: 2,
            moderateNum: 0,
            lowNum: 1,
        }

        expect(result.teamData).toEqual(
            {
                name: '',
                vulnData: vulnData,
                repos: resultRepos,
                offenses: 0,
            } 
        );
        expect(result.orgData).toEqual(
            {
                name: "goodOrg",
                vulnData: vulnData,
                teams: [],
                repos: resultRepos,
                topics: [],
                url: '',
                avatarUrl: ''
            }
        )

        expect(result.seen).toEqual(
            new Set<string>(["abc", "abd"])
        )

        let seenTopics = new  Map<string, Topic>();
        seenTopics.set("topic1", {
            name: "topic1", 
            vulnData: {
                startMonth: new Date().getMonth(),
                critical: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                high: [0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
                moderate: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                low: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                criticalNum: 0,
                highNum: 2,
                moderateNum: 0,
                lowNum: 0,
            },
            repos: [resultRepos[0]]
        })

        seenTopics.set("topic2", {
            name: "topic2", 
            vulnData: {
                startMonth: new Date().getMonth(),
                critical: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                high: [0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
                moderate: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                low: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                criticalNum: 0,
                highNum: 2,
                moderateNum: 0,
                lowNum: 0,
            },
            repos: [resultRepos[0]]
        })

        seenTopics.set("topic3", {
            name: "topic3", 
            vulnData: {
                startMonth: new Date().getMonth(),
                critical: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                high: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                moderate: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                low: [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                criticalNum: 0,
                highNum: 0,
                moderateNum: 0,
                lowNum: 1,
            },
            repos: [resultRepos[1]]
        })
        expect(result.seenTopics).toEqual(
           seenTopics
        )
    })
    //some reason this test retains the values from the previous test? but it works if it runs on its own

    // test("Should return a valid object when given all valid inputs (one vuln dismissed)", async () =>{
     

    //     formatVulnData.mockImplementationOnce((arg1) =>
    //         [
    //             {
    //                 "packageName": "trim",
    //                 "versionNum": "< 0.0.3",
    //                 "createdAt": "2023-02-01T18:38:53Z",
    //                 "dismissedAt": null,
    //                 "fixedAt": null,
    //                 "vulnVersionRange": "0.0.3",
    //                 "classification": "GENERAL",
    //                 "severity": "HIGH",
    //                 "summary": "Regular Expression Denial of Service in trim",
    //                 "vulnerabilityCount": 1,
    //                 "state": "OPEN",
    //                 "url": "url"
    //             },
    //             {
    //                 "packageName": "glob-parent",
    //                 "versionNum": "< 5.1.2",
    //                 "createdAt": "2023-02-01T18:38:54Z",
    //                 "dismissedAt": "2023-03-02T18:38:54Z",
    //                 "fixedAt": null,
    //                 "vulnVersionRange": "5.1.2",
    //                 "classification": "GENERAL",
    //                 "severity": "HIGH",
    //                 "summary": "glob-parent before 5.1.2 vulnerable to Regular Expression Denial of Service in enclosure regex",
    //                 "vulnerabilityCount": 1,
    //                 "state": "DISMISSED",
    //                 "url": "url"
    //             },
    //         ])
    //     formatVulnData.mockImplementationOnce((arg1) =>
    //     [
    //         {
    //             "packageName": "trim",
    //             "versionNum": "< 0.0.3",
    //             "createdAt": "2023-03-01T18:38:53Z",
    //             "dismissedAt": null,
    //             "fixedAt": null,
    //             "vulnVersionRange": "0.0.3",
    //             "classification": "GENERAL",
    //             "severity": "LOW",
    //             "summary": "Regular Expression Denial of Service in trim",
    //             "vulnerabilityCount": 1,
    //             "state": "OPEN",
    //             "url": "url"
    //         }
    //     ])

    //     const newRepos1 = [{
    //         name: "repo1", 
    //         id: "abc", 
    //         low: 0, 
    //         moderate: 0, 
    //         high: 0, 
    //         critical: 0,
    //         repositoryTopics: ["topic1", "topic2"]
    //     },
    //     {
    //         name: "repo2", 
    //         id: "abd", 
    //         low: 0, 
    //         moderate: 0, 
    //         high: 0, 
    //         critical: 0,
    //         repositoryTopics: ["topic3"]
    //     }]

        
    //     const teamData1 = EMPTY_TEAM
    //     teamData1.vulnData.startMonth = new Date().getMonth();

    //     const orgData1 = EMPTY_ORG
    //     orgData1.name = "goodOrg";
    //     orgData1.vulnData.startMonth = new Date().getMonth();

    //     const result = await getVulnDataForRepos(mockedGraphQl, "goodOrg", newRepos1, teamData1, orgData1, new Set<string>, new Map<string, Topic>);
        
    //     const resultRepos = [{
    //         name: "repo1", 
    //         id: "abc", 
    //         low: 0, 
    //         moderate: 0, 
    //         high: 1, 
    //         critical: 0,
    //         repositoryTopics: ["topic1", "topic2"]
    //     },
    //     {
    //         name: "repo2", 
    //         id: "abd", 
    //         low: 1, 
    //         moderate: 0, 
    //         high: 0, 
    //         critical: 0,
    //         repositoryTopics: ["topic3"]
    //     }]

    //     const vulnData = {
    //         startMonth: new Date().getMonth(),
    //         critical: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //         high: [0, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    //         moderate: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //         low: [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    //         criticalNum: 0,
    //         highNum: 1,
    //         moderateNum: 0,
    //         lowNum: 1,
    //     }

    //     expect(result.teamData).toEqual(
    //         {
    //             name: '',
    //             vulnData: vulnData,
    //             repos: resultRepos,
    //             offenses: 0,
    //         } 
    //     );
    //     expect(result.orgData).toEqual(
    //         {
    //             name: "goodOrg",
    //             vulnData: vulnData,
    //             teams: [],
    //             repos: resultRepos,
    //             topics: [],
    //             url: '',
    //             avatarUrl: ''
    //         }
    //     )

    //     expect(result.seen).toEqual(
    //         new Set<string>(["abc", "abd"])
    //     )

    //     let seenTopics = new  Map<string, Topic>();
    //     seenTopics.set("topic1", {
    //         name: "topic1", 
    //         vulnData: {
    //             startMonth: new Date().getMonth(),
    //             critical: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //             high: [0, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    //             moderate: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //             low: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //             criticalNum: 0,
    //             highNum: 1,
    //             moderateNum: 0,
    //             lowNum: 0,
    //         },
    //         repos: [resultRepos[0]]
    //     })

    //     seenTopics.set("topic2", {
    //         name: "topic2", 
    //         vulnData: {
    //             startMonth: new Date().getMonth(),
    //             critical: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //             high: [0, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    //             moderate: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //             low: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //             criticalNum: 0,
    //             highNum: 1,
    //             moderateNum: 0,
    //             lowNum: 0,
    //         },
    //         repos: [resultRepos[0]]
    //     })

    //     seenTopics.set("topic3", {
    //         name: "topic3", 
    //         vulnData: {
    //             startMonth: new Date().getMonth(),
    //             critical: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //             high: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //             moderate: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //             low: [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    //             criticalNum: 0,
    //             highNum: 0,
    //             moderateNum: 0,
    //             lowNum: 1,
    //         },
    //         repos: [resultRepos[1]]
    //     })
    //     expect(result.seenTopics).toEqual(
    //        seenTopics
    //     )
    // })
})