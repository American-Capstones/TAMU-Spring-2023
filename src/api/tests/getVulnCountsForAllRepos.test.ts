import { countOpenVulnData } from "../../utils/functions";
import { getReposForTeam } from "../getReposForTeam";
import { getVulnCountsForAllRepos } from "../getVulnCountsForAllRepos";
import { getVulnsFromRepo } from "../getVulnsFromRepo";

jest.mock('../getVulnsFromRepo', () => ({
    ...jest.requireActual('../getVulnsFromRepo'),
    getVulnsFromRepo: jest.fn(),
}));

jest.mock('../../utils/functions', () => ({
    ...jest.requireActual('../../utils/functions'),
    countOpenVulnData: jest.fn(),
}));


const mockedGraphQl = jest.fn().mock

describe("getVulnCountsForAllRepos Test Suite", () => {
    test("Should return valid vuln counts for each repo", async () => {
        getVulnsFromRepo.mockImplementation(() => ["vuln1", "vuln2"])
        countOpenVulnData.mockImplementationOnce(() =>
        ({
            "critical": 5,
            "high": 10,
            "moderate": 15,
            "low": 20,
        })
        )
        countOpenVulnData.mockImplementationOnce(() =>
        ({
            "critical": 15,
            "high": 20,
            "moderate": 25,
            "low": 30,
        })
        )
        const repoInput = [
            {
                name: "repo1",
                critical: undefined,
                high: undefined,
                moderate: undefined,
                low: undefined
            },
            {
                name: "repo2",
                critical: undefined,
                high: undefined,
                moderate: undefined,
                low: undefined
            },

        ]

        const Repos = await getVulnCountsForAllRepos(mockedGraphQl, repoInput, "", 10);
        expect(Repos).toEqual(
            [
                {
                    name: "repo1",
                    critical: 5,
                    high: 10,
                    moderate: 15,
                    low: 20
                },
                {
                    name: "repo2",
                    critical: 15,
                    high: 20,
                    moderate: 25,
                    low: 30
                },
            ]
        );
    });


    test("Should return undefined vuln counts for a team with no vulns", async () => {
        jest.resetAllMocks();
        getVulnsFromRepo.mockImplementation(() => ["vuln1", "vuln2"])
        getVulnsFromRepo.mockImplementation(() => [])

        const mockedGraphQl = jest.fn().mock
        const repoInput = [
            {
                name: "repo1",
                critical: undefined,
                high: undefined,
                moderate: undefined,
                low: undefined
            },
            {
                name: "repo2",
                critical: undefined,
                high: undefined,
                moderate: undefined,
                low: undefined
            },

        ]
        const Repos = await getVulnCountsForAllRepos(mockedGraphQl, repoInput, "", 10);
        expect(Repos).toEqual(
            [
                {
                    name: "repo1",
                    critical: undefined,
                    high: undefined,
                    moderate: undefined,
                    low: undefined
                },
                {
                    name: "repo2",
                    critical: undefined,
                    high: undefined,
                    moderate: undefined,
                    low: undefined
                },
            ]
        );
    });
});