import {getRepoNodes} from "../getReposForTeam";

const getReposForTeam = require('../getReposForTeam');
const graphql = require('../useOctokitGraphQl');
jest.mock('../useOctokitGraphQl');

describe("getRepoNodes Test Suite", () => {
  test("Should return empty list when given invalid org name", async () => {
    const mockedGraphQl = jest.fn().mockImplementation((Query, Arguments) => Promise.resolve(
      {
        "organization": null,
        "errors": [
          {
            "type": "NOT_FOUND",
            "path": [
              "organization"
            ],
            "locations": [
              {
                "line": 7,
                "column": 11
              }
            ],
            "message": "Could not resolve to an Organization with the login of 'invalid'."
          }
        ]
      }
    ));

    const Repos = await getRepoNodes(mockedGraphQl, "invalid", "", 10);
    expect(Repos).toEqual([]);
  });

  test("Should return empty list when given invalid team name", async () => {
    const mockedGraphQl = jest.fn().mockImplementation((Query, Arguments) => Promise.resolve(
      {
        "organization": {
            "teams": {
              "nodes": []
            }
          }
        }
    ));

    const Repos = await getRepoNodes(mockedGraphQl, "valid", "invalid", 10);
    expect(Repos).toEqual([]);
  });

  test("Should return empty list when given a 'first' value that is too large", async () => {
    const mockedGraphQl = jest.fn().mockImplementation((Query, Arguments) => Promise.resolve(
      {
        "organization": null,
        "errors": [
          {
            "type": "EXCESSIVE_PAGINATION",
            "path": [
              "organization",
              "teams"
            ],
            "locations": [
              {
                "line": 8,
                "column": 13
              }
            ],
            "message": "Requesting 101 records on the `teams` connection exceeds the `first` limit of 100 records."
          }
        ]
      }
    ));

    const Repos = await getRepoNodes(mockedGraphQl, "valid", "valid", 101);
    expect(Repos).toEqual([]);
  });

  test("Should return a valid list of repositories when given all valid inputs", async () => {
    const mockedGraphQl = jest.fn().mockImplementation((Query, Arguments) => Promise.resolve(
      {
          "organization": {
            "teams": {
              "nodes": [
                {
                  "repositories": {
                    "pageInfo": {
                      "hasNextPage": false,
                      "endCursor": ""
                    },
                    "nodes": [
                      {
                        "name": "repo1",
                        "id": "1"
                      }, 
                      {
                        "name": "repo2",
                        "id": "2"
                      }
                    ]
                  }
                }
              ]
            }
          }
        }
    ));

    const Repos = await getRepoNodes(mockedGraphQl, "valid", "valid", 10);
    expect(Repos).toEqual([
      {
        "id": "1",
        "name": "repo1",
      },
      {
        "id": "2",
        "name": "repo2",
      }
    ]);
  });

})