import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Divider, Grid } from '@material-ui/core';
import { getVulnerabilitiesFromRepo } from '../../../api/getVulnerabilitiesFromRepo';
import { sortVulnData } from '../../../utils/functions';
import { RepoVulns, VulnInfoFormatted, VulnInfoUnformatted } from '../../../utils/types';
import {
  HorizontalScrollGrid,
  InfoCard,
  StatusOK,
} from '@backstage/core-components';
import { VulnList } from '../../VulnList';
import { Skeleton } from '@material-ui/lab';

const columnStyle: React.CSSProperties = {
  marginRight: "4em",
  display: "flex",
  flexDirection: "column",
  minWidth: "25em",
  maxWidth: "25em"
}

export const Repo = ({ }: {}) => {

  const { repoName } = useParams();
  const [loadingState, setLoadingState] = useState<Boolean>(true);
  const [repoInfo, setRepoInfo] = useState<RepoVulns>({
    critical: [],
    high: [],
    moderate: [],
    low: [],
  })

  const dummy_data : VulnInfoUnformatted[] = [
    {
      createdAt: "2023-03-01T18:38:53Z",
      dismissedAt: "null",
      fixedAt: "null",
      securityAdvisory: {
        summary: "Regular Expression Denial of Service in trim",
        severity: "HIGH",
        classification: "GENERAL",
        vulnerabilities: {
          totalCount: 1
        }
      },
      securityVulnerability: {
        package: {
          name: "trim"
        },
        firstPatchedVersion: {
          identifier: "0.0.3"
        },
        vulnerableVersionRange: "< 0.0.3"
      },
      state: "OPEN"
    },
    {
      createdAt: "2023-03-01T18:38:54Z",
      dismissedAt: "null",
      fixedAt: "null",
      securityAdvisory: {
        summary: "glob-parent before 5.1.2 vulnerable to Regular Expression Denial of Service in enclosure regex",
        severity: "HIGH",
        classification: "GENERAL",
        vulnerabilities: {
          totalCount: 1
        }
      },
      securityVulnerability: {
        package: {
          name: "glob-parent"
        },
        firstPatchedVersion: {
          identifier: "5.1.2"
        },
        vulnerableVersionRange: "< 5.1.2"
      },
      state: "OPEN"
    },
    {
      createdAt: "2023-03-01T18:38:54Z",
      dismissedAt: "null",
      fixedAt: "null",
      securityAdvisory: {
        summary: "Terser insecure use of regular expressions leads to ReDoS",
        severity: "HIGH",
        classification: "GENERAL",
        vulnerabilities: {
          totalCount: 2
        }
      },
      securityVulnerability: {
        package: {
          name: "terser"
        },
        firstPatchedVersion: {
          identifier: "4.8.1"
        },
        vulnerableVersionRange: "< 4.8.1"
      },
      state: "OPEN"
    },
    {
      createdAt: "2023-03-01T18:38:54Z",
      dismissedAt: "null",
      fixedAt: "null",
      securityAdvisory: {
        summary: "Terser insecure use of regular expressions leads to ReDoS",
        severity: "HIGH",
        classification: "GENERAL",
        vulnerabilities: {
          totalCount: 2
        }
      },
      securityVulnerability: {
        package: {
          name: "terser"
        },
        firstPatchedVersion: {
          identifier: "5.14.2"
        },
        vulnerableVersionRange: ">= 5.0.0, < 5.14.2"
      },
      state: "OPEN"
    },
    {
      createdAt: "2023-03-01T18:38:54Z",
      dismissedAt: "null",
      fixedAt: "null",
      securityAdvisory: {
        summary: "Prototype pollution in webpack loader-utils",
        severity: "CRITICAL",
        classification: "GENERAL",
        vulnerabilities: {
          totalCount: 2
        }
      },
      securityVulnerability: {
        package: {
          name: "loader-utils"
        },
        firstPatchedVersion: {
          identifier: "2.0.3"
        },
        vulnerableVersionRange: ">= 2.0.0, < 2.0.3"
      },
      state: "OPEN"
    }
  ]

  const sorted_dummy_data = sortVulnData(dummy_data);

  useEffect(() => {
    if(repoName)
      setTimeout(()=> {

        setRepoInfo(sorted_dummy_data);
        setLoadingState(false);
      }, 1500);
  }, [])
  return (
    <div style={{
      width: "100%",
      height: "100%"
    }}>
      <h1>Repository Vulnerabilities</h1>
      <div style={{
        display: 'flex',
        flexDirection: 'row'
      }}>
        <div title="Critical" style={columnStyle}>
          <h3>Critical Vulnerabilities</h3>
          {loadingState == true &&
            <Skeleton variant='rect' width={"100%"} height={"10em"} />
          }
          <VulnList vulns={repoInfo.critical} />
        </div>
        <div title="High" style={columnStyle}>
          <h3>High Vulnerabilities</h3>
          {loadingState == true &&
            <Skeleton variant='rect' width={"100%"} height={"10em"} />
          }
          <VulnList vulns={repoInfo.high} />
        </div>
        <div title="Moderate" style={columnStyle}>
          <h3>Moderate Vulnerabilities</h3>
          {loadingState == true &&
            <Skeleton variant='rect' width={"100%"} height={"10em"} />
          }
          <VulnList vulns={repoInfo.moderate} />
        </div>
        <div title="Low" style={columnStyle}>
          <h3>Low Vulnerabilities</h3>
          {loadingState == true &&
            <Skeleton variant='rect' width={"100%"} height={"10em"} />
          }
          <VulnList vulns={repoInfo.low} />
        </div>
      </div>
    </div>
  );
};
