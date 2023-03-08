import React from 'react';
import { Divider, Grid } from '@material-ui/core';
import {
  HorizontalScrollGrid,
  InfoCard,
  StatusOK,
} from '@backstage/core-components';
import { ExampleFetchComponent } from '../../ExampleFetchComponent';
import { VulnList, VulnInfo, RepoVulns } from '../../VulnList';
import { BorderRight } from '@material-ui/icons';

let testArrays: RepoVulns = {
  critical: [
    {
      packageName: "Maven",
      versionNum: 1.6,
      createdAt: "1/2/23",
      pullRequest: "Yes",
      dismissedAt: "1/5/23",
      fixedAt: "1/6/23",
      vulnVersionRange: ">= 1.0.0",
      classification: "none",
      severity: "CRITICAL",
      summary: "This is a summary of a critical vulnerability",
      vulnerabilityCount: [1, 2, 3],
      state: "OPEN",
    },
    {
      packageName: "Maven",
      versionNum: 2.6,
      createdAt: "1/2/23",
      pullRequest: "Yes",
      dismissedAt: "1/5/23",
      fixedAt: "1/6/23",
      vulnVersionRange: ">= 1.0.0",
      classification: "none",
      severity: "critical",
      summary: "vuln",
      vulnerabilityCount: [1, 2, 3],
      state: "FIXED",
    }
  ],
  high: [
    {
      packageName: "Maven",
      versionNum: 1.6,
      createdAt: "1/2/23",
      pullRequest: "Yes",
      dismissedAt: "1/5/23",
      fixedAt: "1/6/23",
      vulnVersionRange: ">= 1.0.0",
      classification: "none",
      severity: "critical",
      summary: "vuln",
      vulnerabilityCount: [1, 2, 3],
      state: "FIXED",
    },
    {
      packageName: "Maven",
      versionNum: 2.6,
      createdAt: "1/2/23",
      pullRequest: "Yes",
      dismissedAt: "1/5/23",
      fixedAt: "1/6/23",
      vulnVersionRange: ">= 1.0.0",
      classification: "none",
      severity: "critical",
      summary: "vuln",
      vulnerabilityCount: [1, 2, 3],
      state: "FIXED",
    }
  ],
  moderate: [
    {
      packageName: "Maven",
      versionNum: 1.6,
      createdAt: "1/2/23",
      pullRequest: "Yes",
      dismissedAt: "1/5/23",
      fixedAt: "1/6/23",
      vulnVersionRange: ">= 1.0.0",
      classification: "none",
      severity: "critical",
      summary: "vuln",
      vulnerabilityCount: [1, 2, 3],
      state: "FIXED",
    },
    {
      packageName: "Maven",
      versionNum: 2.6,
      createdAt: "1/2/23",
      pullRequest: "Yes",
      dismissedAt: "1/5/23",
      fixedAt: "1/6/23",
      vulnVersionRange: ">= 1.0.0",
      classification: "none",
      severity: "critical",
      summary: "vuln",
      vulnerabilityCount: [1, 2, 3],
      state: "FIXED",
    }
  ],
  low: [
    {
      packageName: "Maven",
      versionNum: 1.6,
      createdAt: "1/2/23",
      pullRequest: "Yes",
      dismissedAt: "1/5/23",
      fixedAt: "1/6/23",
      vulnVersionRange: ">= 1.0.0",
      classification: "none",
      severity: "critical",
      summary: "vuln",
      vulnerabilityCount: [1, 2, 3],
      state: "FIXED",
    },
    {
      packageName: "Maven",
      versionNum: 2.6,
      createdAt: "1/2/23",
      pullRequest: "Yes",
      dismissedAt: "1/5/23",
      fixedAt: "1/6/23",
      vulnVersionRange: ">= 1.0.0",
      classification: "none",
      severity: "critical",
      summary: "vuln",
      vulnerabilityCount: [1, 2, 3],
      state: "FIXED",
    }
  ]
}

const columnStyle : React.CSSProperties = {
  marginRight: "2em",
}

export const Repo = ({ }: {}) => {

  return (
    <div>
      <h1>Repository Vulnerabilities</h1>
      <HorizontalScrollGrid>
        <div title="Critical" style={columnStyle}>
          <h3>Critical Vulnerabilities</h3>
          <VulnList vulns={testArrays.critical} />
        </div>
        <div title="High" style={columnStyle}>
          <h3>High Vulnerabilities</h3>
          <VulnList vulns={testArrays.high} />
        </div>
        <div title="Moderate" style={columnStyle}>
          <h3>Moderate Vulnerabilities</h3>
          <VulnList vulns={testArrays.moderate} />
        </div>
        <div title="Low" style={columnStyle}>
          <h3>Low Vulnerabilities</h3>
          <VulnList vulns={testArrays.low} />
        </div>
      </HorizontalScrollGrid>
    </div>
  );
};
