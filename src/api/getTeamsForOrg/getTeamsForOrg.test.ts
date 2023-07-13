import { getTeamNodes } from './getTeamsForOrg';

describe('getTeamsForOrg Test Suite', () => {
  it('returns valid list of teams when given all valid inputs', async () => {
    const mockedGraphQl = jest.fn().mockImplementation((Query, Arguments) =>
      Promise.resolve({
        organization: {
          teams: {
            pageInfo: {
              hasNextPage: false,
              endCursor: '',
            },
            nodes: [
              {
                name: 'Sub of subteam',
              },
              {
                name: 'Subteam',
              },
              {
                name: 'Team A',
              },
              {
                name: 'Team B',
              },
            ],
          },
        },
      }),
    );

    const Teams = await getTeamNodes(mockedGraphQl, 'valid', 10);
    expect(Teams).toEqual([
      {
        name: 'Sub of subteam',
      },
      {
        name: 'Subteam',
      },
      {
        name: 'Team A',
      },
      {
        name: 'Team B',
      },
    ]);
  });

  it("returns empty list when given 'first' value that is too large", async () => {
    const mockedGraphQl = jest.fn().mockImplementation((Query, Arguments) =>
      Promise.resolve({
        organization: null,
        errors: [
          {
            type: 'EXCESSIVE_PAGINATION',
            path: ['organization', 'teams'],
            locations: [
              {
                line: 8,
                column: 11,
              },
            ],
            message: 'Requesting 101 records on the `teams` connection exceeds the `first` limit of 100 records.',
          },
        ],
      }),
    );

    const Teams = await getTeamNodes(mockedGraphQl, 'valid', 10);
    expect(Teams).toEqual([]);
  });

  it('returns empty list when given invalid org name', async () => {
    const mockedGraphQl = jest.fn().mockImplementation((Query, Arguments) =>
      Promise.resolve({
        organization: null,
        errors: [
          {
            type: 'NOT_FOUND',
            path: ['organization'],
            locations: [
              {
                line: 7,
                column: 9,
              },
            ],
            message: "Could not resolve to an Organization with the login of 'invalid'.",
          },
        ],
      }),
    );

    const Teams = await getTeamNodes(mockedGraphQl, 'invalid', 10);
    expect(Teams).toEqual([]);
  });
});
