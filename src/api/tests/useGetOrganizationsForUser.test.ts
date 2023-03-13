import { act, renderHook } from '@testing-library/react-hooks';
import { useGetOrgsForUser } from '../useGetOrganizationsForUser';

describe("Should Throw Error for Invalid Input", () => {
  test("Invalid orgLimit; value too small", () => {
    const { result } = renderHook(() => useGetOrgsForUser(0));

    expect(result.error?.message).toEqual(
      "Invalid orgLimit"
    );
  });

  test("Invalid orgLimit; value too large", () => {
    const { result } = renderHook(() => useGetOrgsForUser(100));

    expect(result.error?.message).toEqual(
      "Invalid orgLimit"
    );
  });

  test("Invalid orgLimit; value undefined", () => {
    const { result } = renderHook(() => useGetOrgsForUser(undefined));

    expect(result.error?.message).toEqual(
      "Invalid orgLimit"
    );
  });
});