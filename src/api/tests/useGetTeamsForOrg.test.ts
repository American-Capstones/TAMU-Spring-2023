import { act, renderHook } from '@testing-library/react-hooks';
import { useGetTeamsForOrg } from "../useGetTeamsForOrg";
import { useOctokitGraphQl } from '../useOctokitGraphQl';

// const mockGraphQL = jest.fn();

// jest.mock("../useOctokitGraphQl", () => {
//   return jest.fn().mockImplementation(() => {
// 		return {
// 			graphQl: mockGraphQL
// 		};
// 	});
// });

describe("Should Throw Error for Invalid Input", () => {
  test("Invalid orgLogin value; empty string", () => {
    const { result } = renderHook(() => useGetTeamsForOrg("", 10));

    expect(result.error?.message).toEqual(
      "Invalid orgLogin"
    );
  });

  test("Invalid orgLogin value; value undefined", () => {
    const { result } = renderHook(() => useGetTeamsForOrg(undefined, 10));

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

  test("Invalid teamLimit; value undefined", () => {
    const { result } = renderHook(() => useGetTeamsForOrg("org", undefined));

    expect(result.error?.message).toEqual(
      "Invalid teamLimit"
    );
  });
});


// describe('githubIssuesApi', () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('fetchIssuesByRepoFromGithub', () => {

//     it('should call GitHub API with correct query with fragment for each repo', async () => {
//       const { result } = renderHook(() => useGetTeamsForOrg("test", 10));

//       //expect(useOctokitGraphQl).toHaveBeenCalledTimes(1);
//       expect(useOctokitGraphQl.graphql).toHaveBeenCalledTimes(1);
//     });
//   });
// });