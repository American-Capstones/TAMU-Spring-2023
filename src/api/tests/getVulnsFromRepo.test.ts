import {getVulnerabilityNodes} from "../getVulnsFromRepo";

const getVulnsFromRepo = require('../getVulnsFromRepo');
const graphql = require('../useOctokitGraphQl');
jest.mock('../useOctokitGraphQl');

describe("getVulnsFromRepo Test Suite", () => {
  test("Should return a valid list of vulnerabilities when given all valid inputs", async () => {
    const mockedGraphQl = jest.fn().mockImplementation((Query, Arguments) => Promise.resolve(
        {
            "repository": {
              "name": "validRepo",
              "url": "https://github.com/validOrg/validRepo",
              "vulnerabilityAlerts": {
                "pageInfo": {
                    "hasNextPage": false,
                    "endCursor": ""
                },
                "nodes": [
                  {
                    "number": 1,
                    "createdAt": "2023-03-01T18:32:56Z",
                    "dismissedAt": null,
                    "fixedAt": null,
                    "securityAdvisory": {
                      "summary": "vuln1 summary",
                      "severity": "MODERATE",
                      "classification": "GENERAL",
                      "vulnerabilities": {
                        "totalCount": 1
                      }
                    },
                    "securityVulnerability": {
                      "package": {
                        "name": "Vuln1 name"
                      },
                      "firstPatchedVersion": {
                        "identifier": "8.0.1"
                      },
                      "vulnerableVersionRange": "< 8.0.1"
                    },
                    "state": "OPEN"
                  },
                  {
                    "number": 1,
                    "createdAt": "2023-03-01T18:32:56Z",
                    "dismissedAt": "2023-03-10T18:46:04Z",
                    "fixedAt": null,
                    "securityAdvisory": {
                      "summary": "vuln2 summary",
                      "severity": "HIGH",
                      "classification": "GENERAL",
                      "vulnerabilities": {
                        "totalCount": 1
                      }
                    },
                    "securityVulnerability": {
                      "package": {
                        "name": "Vuln2 name"
                      },
                      "firstPatchedVersion": {
                        "identifier": "8.0.1"
                      },
                      "vulnerableVersionRange": "< 8.0.1"
                    },
                    "state": "DISMISSED"
                  }
                ]
              }
            }
          }
    ));

    const Vulns = await getVulnerabilityNodes(mockedGraphQl, "validRepo", "validOrg");
    expect(Vulns).toEqual([
      {
        "number": 1,
        "createdAt": "2023-03-01T18:32:56Z",
        "dismissedAt": null,
        "fixedAt": null,
        "securityAdvisory": {
        "classification": "GENERAL",
        "severity": "MODERATE",
        "summary": "vuln1 summary",
            "vulnerabilities": {
            "totalCount": 1,
            }
        },
        "securityVulnerability":  {
            "firstPatchedVersion":  {
                "identifier": "8.0.1",
            },
            "package": {
            "name": "Vuln1 name",
            },
            "vulnerableVersionRange": "< 8.0.1",
       },
         "state": "OPEN",
         "url": "https://github.com/validOrg/validRepo/security/dependabot/1",
    },
    {
    "number": 1,
    "createdAt": "2023-03-01T18:32:56Z",
    "dismissedAt": "2023-03-10T18:46:04Z",
    "fixedAt": null,
    "securityAdvisory":  {
        "classification": "GENERAL",
        "severity": "HIGH",
        "summary": "vuln2 summary",
        "vulnerabilities":  {
        "totalCount": 1,
        }
     },
    "securityVulnerability":  {
        "firstPatchedVersion":  {
            "identifier": "8.0.1",
        },
        "package":  {
            "name": "Vuln2 name",
        },
        "vulnerableVersionRange": "< 8.0.1",
    },
    "state": "DISMISSED",
    "url": "https://github.com/validOrg/validRepo/security/dependabot/1",
    },
    ]);
  });

  test("Should return empty list when given a 'first' value that is too large", async () => {
    const mockedGraphQl = jest.fn().mockImplementation((Query, Arguments) => Promise.resolve(
        {
            "repository": {
              "name": "validRepo",
              "url": "https://github.com/validOrg/validRepo",
              "vulnerabilityAlerts": null
            },
          "errors": [
            {
              "type": "EXCESSIVE_PAGINATION",
              "path": [
                "repository",
                "vulnerabilityAlerts"
              ],
              "locations": [
                {
                  "line": 10,
                  "column": 9
                }
              ],
              "message": "Requesting 101 records on the `vulnerabilityAlerts` connection exceeds the `first` limit of 100 records."
            }
          ]
        }
    ));

    const Vulns = await getVulnerabilityNodes(mockedGraphQl, "validRepo", "validOrg");
    expect(Vulns).toEqual([]);
  });

  test("Should return empty list when given an invalid org name", async () => {
    const mockedGraphQl = jest.fn().mockImplementation((Query, Arguments) => Promise.resolve(
        {
            "repository": null,
            "errors": [
            {
              "type": "NOT_FOUND",
              "path": [
                "repository"
              ],
              "locations": [
                {
                  "line": 7,
                  "column": 9
                }
              ],
              "message": "Could not resolve to a Repository with the name 'invalidOrg/validRepo'."
            }
          ]
        }
    ));

    const Vulns = await getVulnerabilityNodes(mockedGraphQl, "invalidOrg", "validRepo", 10);
    expect(Vulns).toEqual([]);
  });

  test("Should return empty list when given an invalid repo name", async () => {
    const mockedGraphQl = jest.fn().mockImplementation((Query, Arguments) => Promise.resolve(
        {
         "repository": null,
          "errors": [
            {
              "type": "NOT_FOUND",
              "path": [
                "repository"
              ],
              "locations": [
                {
                  "line": 7,
                  "column": 9
                }
              ],
              "message": "Could not resolve to a Repository with the name 'validOrg/invalidRepo'."
            }
          ]
        }
    ));

    const Vulns = await getVulnerabilityNodes(mockedGraphQl, "validOrg", "invalidRepo", 10);
    expect(Vulns).toEqual([]);
  });
})