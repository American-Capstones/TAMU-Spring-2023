import { getRepoNodesForOrg } from './getReposForOrg';

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

    const Repos = await getRepoNodesForOrg(mockedGraphQl, 'invalid', 10);
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

    const Repos = await getRepoNodesForOrg(mockedGraphQl, 'valid', 101);
    expect(Repos).toEqual([]);
  });

  it('returns valid list of repositories when given all valid inputs', async () => {
    const mockedGraphQl = jest.fn().mockImplementation((Query, Arguments) =>
      Promise.resolve({
        organization: {
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
                        id: '1',
                        topic: {
                          name: 'topic1',
                        },
                      },
                    },
                    {
                      node: {
                        id: '2',
                        topic: {
                          name: 'topic2',
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
                  edges: [
                    {
                      node: {
                        id: '3',
                        topic: {
                          name: 'topic3',
                        },
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

    const Repos = await getRepoNodesForOrg(mockedGraphQl, 'valid', 10);
    expect(Repos).toEqual([
      {
        id: '1',
        critical: 0,
        high: 0,
        moderate: 0,
        low: 0,
        name: 'repo1',
        repositoryTopics: ['topic1', ', ', 'topic2'],
      },
      {
        id: '2',
        critical: 0,
        high: 0,
        moderate: 0,
        low: 0,
        name: 'repo2',
        repositoryTopics: ['topic3'],
      },
    ]);
  });
});
