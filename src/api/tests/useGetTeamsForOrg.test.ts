import { act, renderHook } from '@testing-library/react-hooks';
import { useGetTeamsForOrg } from "../useGetTeamsForOrg";

//const mockGraphQLQuery = jest.fn(() => ({}));

describe("Should Throw Error for Invalid Input", () => {
  test("Invalid orgLogin value", () => {
    const { result } = renderHook(() => useGetTeamsForOrg("", 10));

    expect(result.error?.message).toEqual(
      "Invalid orgLogin"
    );
  });

  test("Invalid teamLimit; value too small", () => {
    const { result } = renderHook(() => useGetTeamsForOrg("org", 0));

    expect(result.error?.message).toEqual(
      "Invalid teamLimit"
    );
  });

  test("Invalid teamLimit; value too large", () => {
    const { result } = renderHook(() => useGetTeamsForOrg("org", 100));

    expect(result.error?.message).toEqual(
      "Invalid teamLimit"
    );
  });
});


// describe('githubIssuesApi', () => {
//   beforeEach(() => {
//     jest.resetAllMocks();
//   });

//   describe('fetchIssuesByRepoFromGithub', () => {

//     it('should call GitHub API with correct query with fragment for each repo', async () => {
//       const { result } = renderHook(() => useGetTeamsForOrg("test", 10));

//       expect(mockGraphQLQuery).toHaveBeenCalledTimes(1);
//     });
//   });
// });