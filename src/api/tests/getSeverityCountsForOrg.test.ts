import { act, renderHook } from '@testing-library/react-hooks';
import { getVulnerabilitiesFromRepo } from '../getVulnsFromRepo';
import { useGetRepositoriesForTeam } from '../useGetRepositoriesForTeam';
import { useGetSeverityCountsForOrg } from '../useGetSeverityCountsForOrg';
import { useGetTeamsForOrg } from '../useGetTeamsForOrg';

jest.mock('../useGetTeamsForOrg', () => ({
    ...jest.requireActual('../useGetTeamsForOrg'),
    useGetTeamsForOrg: jest.fn().mockReturnValue(["team1", "team2", "team3"]),
}));

jest.mock('../useGetRepositoriesForTeam', () => ({
    ...jest.requireActual('../useGetRepositoriesForTeam'),
    useGetRepositoriesForTeam: jest.fn().mockReturnValue([]),
}));


jest.mock('../getVulnerabilitiesFromRepo', () => ({
    ...jest.requireActual('../getVulnerabilitiesFromRepo'),
    getVulnerabilitesFromRepo: jest.fn().mockReturnValue(),
}));

describe("Should call helper functions", () => {
  test("Should call useGetTeamsForOrg only once", () => {
    const { result } = renderHook(async() => await useGetSeverityCountsForOrg("org", 10, 10));

    expect(useGetTeamsForOrg).toHaveBeenCalledTimes(1);
  });

  test("Should call useGetRepositories for each item in TeamsInOrg (3 here)", () => {
    const { result } = renderHook(async() => await useGetSeverityCountsForOrg("org", 10, 10));

    expect(useGetRepositoriesForTeam).toHaveBeenCalledTimes(3);
  });
});