import {getOrgNodes} from "../getOrgsForUser";

describe("getOrgsForUser Test Suite", () => {
  test("Should return a valid list of repositories when given all valid inputs", async () => {
    const mockedGraphQl = jest.fn().mockImplementation((Query, Arguments) => Promise.resolve(
      {
        "viewer": {
          "organizations": {
            "pageInfo": {
              "hasNextPage": false,
              "endCursor": ""
            },
            "nodes": [
              {
                "url" : "url.com",
                "avatarUrl": "avatarUrl.com",
                "name": "ORG_ONE"
              },
              {
                "url" : "url2.com",
                "avatarUrl": "avatarUrl2.com",
                "name": "ORG_TWO"
              }
            ]
          }
        }
      }
    ));

    const orgNodes = await getOrgNodes(mockedGraphQl, 10);
    expect(orgNodes).toEqual([
      {
        "url" : "url.com",
        "avatarUrl": "avatarUrl.com",
        "name": "ORG_ONE",
      },
      {
        "url" : "url2.com",
        "avatarUrl": "avatarUrl2.com",
        "name": "ORG_TWO",
      }
    ]);
  });

  test("Should return empty list when given a 'first' value that is too large", async () => {
    const mockedGraphQl = jest.fn().mockImplementation((Query, Arguments) => Promise.resolve(
      {
        "errors": [
          {
            "type": "EXCESSIVE_PAGINATION",
            "path": [
              "viewer",
              "organizations"
            ],
            "locations": [
              {
                "line": 8,
                "column": 15
              }
            ],
            "message": "Requesting 101 records on the `organizations` connection exceeds the `first` limit of 100 records."
          }
        ]
      }
    ));

    const orgNodes = await getOrgNodes(mockedGraphQl, 101);
    expect(orgNodes).toEqual([]);
  });
})