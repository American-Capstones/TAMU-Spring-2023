import {getOrgNodes} from "../getOrgsForUser";

const getOrgsForUser = require('../getOrgsForUser');
const graphql = require('../useOctokitGraphQl');
jest.mock('../useOctokitGraphQl');

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
                "name": "ORG_ONE"
              },
              {
                "name": "ORG_TWO"
              }
            ]
          }
        }
      }
    ));

    const result = await getOrgNodes(mockedGraphQl, 10);
    expect(result.orgNodes).toEqual([
      {
        "name": "ORG_ONE",
      },
      {
        "name": "ORG_TWO",
      }
    ]);
    expect(result.error).toEqual(undefined);
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

    const result = await getOrgNodes(mockedGraphQl, 101);
    expect(result.orgNodes).toEqual([]);
    expect(result.error).toEqual(
      {
        "locations": 
            [
              {
                "column": 15, 
                "line": 8
              }
            ], 
        "message": "Requesting 101 records on the `organizations` connection exceeds the `first` limit of 100 records.",
        "path": ["viewer", "organizations"], 
        "type": "EXCESSIVE_PAGINATION"
      });
  });
})