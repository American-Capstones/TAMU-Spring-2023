import { getRepoNodes } from '../getReposForTeam';

describe('getRepoNodes Test Suite', () => {
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
                column: 11,
              },
            ],
            message: "Could not resolve to an Organization with the login of 'invalid'.",
          },
        ],
      }),
    );

    const Repos = await getRepoNodes(mockedGraphQl, 'invalid', '', 10);
    expect(Repos).toEqual([]);
  });

  it('returns empty list when given invalid team name', async () => {
    const mockedGraphQl = jest.fn().mockImplementation((Query, Arguments) =>
      Promise.resolve({
        organization: {
          teams: {
            nodes: [],
          },
        },
      }),
    );

    const Repos = await getRepoNodes(mockedGraphQl, 'valid', 'invalid', 10);
    expect(Repos).toEqual([]);
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
                column: 13,
              },
            ],
            message: 'Requesting 101 records on the `teams` connection exceeds the `first` limit of 100 records.',
          },
        ],
      }),
    );

    const Repos = await getRepoNodes(mockedGraphQl, 'valid', 'valid', 101);
    expect(Repos).toEqual([]);
  });

  it('returns valid list of repositories when given all valid inputs', async () => {
    const mockedGraphQl = jest.fn().mockImplementation((Query, Arguments) =>
      Promise.resolve({
        organization: {
          teams: {
            nodes: [
              {
                repositories: {
                  pageInfo: {
                    hasNextPage: false,
                    endCursor: '',
                  },
                  nodes: [
                    {
                      name: 'repo1',
                      id: '1',
                      repositoryTopics: {
                        edges: [
                          {
                            node: {
                              id: '0',
                              topic: {
                                name: 'topic3',
                              },
                            },
                          },
                          {
                            node: {
                              id: '0',
                              topic: {
                                name: 'topic4',
                              },
                            },
                          },
                        ],
                      },
                    },
                    {
                      name: 'repo2',
                      id: '2',
                      repositoryTopics: {
                        edges: [],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      }),
    );

    const Repos = await getRepoNodes(mockedGraphQl, 'valid', 'valid', 10);
    expect(Repos).toEqual([
      {
        id: '1',
        critical: 0,
        high: 0,
        moderate: 0,
        low: 0,
        name: 'repo1',
        repositoryTopics: ['topic3', ', ', 'topic4'],
      },
      {
        id: '2',
        critical: 0,
        high: 0,
        moderate: 0,
        low: 0,
        name: 'repo2',
        repositoryTopics: [],
      },
    ]);
  });
});
