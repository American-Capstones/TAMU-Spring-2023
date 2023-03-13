import { act, renderHook } from '@testing-library/react-hooks';
import { useGetRepositoriesForTeam } from '../useGetRepositoriesForTeam';

describe("Should Throw Error for Invalid Input", () => {
  test("Invalid orgLogin value; empty string", () => {
    const { result } = renderHook(() => useGetRepositoriesForTeam("", "team", 10));

    expect(result.error?.message).toEqual(
      "Invalid orgLogin"
    );
  });

  test("Invalid orgLogin value; value undefined", () => {
    const { result } = renderHook(() => useGetRepositoriesForTeam(undefined, "team", 10));

    expect(result.error?.message).toEqual(
      "Invalid orgLogin"
    );
  });

  test("Invalid teamLogin value; empty string", () => {
    const { result } = renderHook(() => useGetRepositoriesForTeam("org", "", 10));

    expect(result.error?.message).toEqual(
      "Invalid teamLogin"
    );
  });

  test("Invalid teamLogin value; value undefined", () => {
    const { result } = renderHook(() => useGetRepositoriesForTeam("org", undefined, 10));

    expect(result.error?.message).toEqual(
      "Invalid teamLogin"
    );
  });

  test("Invalid repoLimit; value too small", () => {
    const { result } = renderHook(() => useGetRepositoriesForTeam("org", "team", 0));

    expect(result.error?.message).toEqual(
      "Invalid repoLimit"
    );
  });

  test("Invalid teamLimit; value too large", () => {
    const { result } = renderHook(() => useGetRepositoriesForTeam("org", "team", 100));

    expect(result.error?.message).toEqual(
      "Invalid repoLimit"
    );
  });

  test("Invalid teamLimit; value undefined", () => {
    const { result } = renderHook(() => useGetRepositoriesForTeam("org", "team", undefined));

    expect(result.error?.message).toEqual(
      "Invalid repoLimit"
    );
  });
});

