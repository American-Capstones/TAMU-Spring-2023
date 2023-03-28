// not currently using useGetSeverityCountsForOrg; will update tests when this module is in use.


// import { act, renderHook } from '@testing-library/react-hooks';
// import { getVulnsFromRepo } from '../getVulnsFromRepo';
// import { getReposForTeam } from '../getReposForTeam';
// import { useGetSeverityCountsForOrg } from '../useGetSeverityCountsForOrg';
// import { getTeamsForOrg } from '../getTeamsForOrg';

// jest.mock('../getTeamsForOrg', () => ({
//     ...jest.requireActual('../getTeamsForOrg'),
//     getTeamsForOrg: jest.fn().mockReturnValue(["team1", "team2", "team3"]),
// }));

// jest.mock('../getReposForTeam', () => ({
//     ...jest.requireActual('../getReposForTeam'),
//     getRepositoriesForTeam: jest.fn().mockReturnValue([]),
// }));

// describe("Should call helper functions", () => {
//   test("Should call useGetTeamsForOrg only once", () => {
//     const { result } = renderHook(async() => await useGetSeverityCountsForOrg("org", 10, 10));

//     expect(getTeamsForOrg).toHaveBeenCalledTimes(1);
//   });

//   test("Should call getRepositories for each item in TeamsInOrg (3 here)", () => {
//     const { result } = renderHook(async() => await useGetSeverityCountsForOrg("org", 10, 10));

//     expect(getReposForTeam).toHaveBeenCalledTimes(3);
//   });
// });

describe("", () => {
  test("", () => {

  })
});