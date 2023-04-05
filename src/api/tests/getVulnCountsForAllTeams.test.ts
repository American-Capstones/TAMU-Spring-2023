import { countOpenVulnData } from "../../utils/functions";
import { getReposForTeam } from "../getReposForTeam";
import { getVulnCountsForAllTeams } from "../getVulnCountsForAllTeams";
import { getVulnsFromRepo } from "../getVulnsFromRepo";

jest.mock('../getReposForTeam', () => ({
    ...jest.requireActual('../getReposForTeam'),
    getReposForTeam: jest.fn(),
}));

jest.mock('../getVulnsFromRepo', () => ({
    ...jest.requireActual('../getVulnsFromRepo'),
    getVulnsFromRepo: jest.fn(),
}));

jest.mock('../../utils/functions', () => ({
    ...jest.requireActual('../../utils/functions'),
    countOpenVulnData: jest.fn(),
}));

describe("getVulnCountsForAllTeams Test Suite", () => {
    test("Should return valid vuln counts for each team", async () => {
        getReposForTeam.mockImplementation(() => ["repo1", "repo2"])
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
    
        const mockedGraphQl = jest.fn().mock
        const teamInput = [
            {
                name: "team1",
                critical: undefined, 
                high: undefined, 
                moderate: undefined, 
                low: undefined
            },
            {
                name: "team2",
                critical: undefined, 
                high: undefined, 
                moderate: undefined, 
                low: undefined
            },
            
        ]
        const Repos = await getVulnCountsForAllTeams(mockedGraphQl, teamInput, "");
        expect(Repos).toEqual(
            [
                {
                    name: "team1",
                    critical: 5, 
                    high: 10, 
                    moderate: 15, 
                    low: 20
                },
                {
                    name: "team2",
                    critical: 15, 
                    high: 20, 
                    moderate: 25, 
                    low: 30
                },
            ]
        );
    });

    test("Should return undefined vuln counts for each team if no repos are found", async () => {
        jest.resetAllMocks();
        getReposForTeam.mockImplementation(() => [])
        getVulnsFromRepo.mockImplementation(() => ["vuln1", "vuln2"])
        countOpenVulnData.mockImplementation(() => 
            ({
                "critical": 5,
                "high": 10,
                "moderate": 15,
                "low": 20,
            })
        )
    
        const mockedGraphQl = jest.fn().mock
        const teamInput = [
            {
                name: "team1",
                critical: undefined, 
                high: undefined, 
                moderate: undefined, 
                low: undefined
            },
            {
                name: "team2",
                critical: undefined, 
                high: undefined, 
                moderate: undefined, 
                low: undefined
            },
            
        ]
        const Repos = await getVulnCountsForAllTeams(mockedGraphQl, teamInput, "");
        expect(Repos).toEqual(
            [
                {
                    name: "team1",
                    critical: undefined, 
                    high: undefined, 
                    moderate: undefined, 
                    low: undefined
                },
                {
                    name: "team2",
                    critical: undefined, 
                    high: undefined, 
                    moderate: undefined, 
                    low: undefined
                },
            ]
        );
    });


    test("Should return undefined vuln counts for a team with no vulns", async () => {
        jest.resetAllMocks();
        getReposForTeam.mockImplementation(() => ["repo1", "repo2"])
        getVulnsFromRepo.mockImplementation(() => [])
    
        const mockedGraphQl = jest.fn().mock
        const teamInput = [
            {
                name: "team1",
                critical: undefined, 
                high: undefined, 
                moderate: undefined, 
                low: undefined
            },
            {
                name: "team2",
                critical: undefined, 
                high: undefined, 
                moderate: undefined, 
                low: undefined
            },
            
        ]
        const Repos = await getVulnCountsForAllTeams(mockedGraphQl, teamInput, "");
        expect(Repos).toEqual(
            [
                {
                    name: "team1",
                    critical: undefined, 
                    high: undefined, 
                    moderate: undefined, 
                    low: undefined
                },
                {
                    name: "team2",
                    critical: undefined, 
                    high: undefined, 
                    moderate: undefined, 
                    low: undefined
                },
            ]
        );
    });
});