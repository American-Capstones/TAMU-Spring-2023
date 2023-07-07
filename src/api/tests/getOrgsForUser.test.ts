import { getOrgNodes } from '../getOrgsForUser';

describe('getOrgsForUser Test Suite', () => {
  it('return a valid list of repositories when given all valid inputs', async () => {
    const mockedGraphQl = jest.fn().mockImplementation((Query, Arguments) =>
      Promise.resolve({
        viewer: {
          organizations: {
            pageInfo: {
              hasNextPage: false,
              endCursor: '',
            },
            nodes: [
              {
                url: 'url.com',
                avatarUrl: 'avatarUrl.com',
                name: 'ORG_ONE',
              },
              {
                url: 'url2.com',
                avatarUrl: 'avatarUrl2.com',
                name: 'ORG_TWO',
              },
            ],
          },
        },
      }),
    );

    const orgNodes = await getOrgNodes(mockedGraphQl, 10);
    expect(orgNodes).toEqual([
      {
        url: 'url.com',
        avatarUrl: 'avatarUrl.com',
        name: 'ORG_ONE',
      },
      {
        url: 'url2.com',
        avatarUrl: 'avatarUrl2.com',
        name: 'ORG_TWO',
      },
    ]);
  });
});
