import React from 'react';
import { Grid } from '@material-ui/core';
import {
  InfoCard, 
} from '@backstage/core-components';
import { ExampleFetchComponent } from '../ExampleFetchComponent';
import { VulnList, VulnInfo, RepoVulns } from '../VulnList';

let testArrays : RepoVulns = {
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
      state: "RESOLVED",
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
      state: "resolved",
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
      state: "resolved",
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
      state: "resolved",
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
      state: "resolved",
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
      state: "resolved",
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
      state: "resolved",
    } 
  ]
}

export const Repo = ({  }: { }) => {

  return (
    <div>
        <h1>Repository Vulnerabilities</h1>
        <Grid container spacing={1}>
            <Grid item xs={3}>
            <InfoCard title="Critical">
              <VulnList vulns={testArrays.critical} />
            </InfoCard>
            </Grid>
            <Grid item xs={3}>
            <InfoCard title="High">
              <VulnList vulns={testArrays.high} />
            </InfoCard>
            </Grid>
            <Grid item xs={3}>
            <InfoCard title="Moderate">
              <VulnList vulns={testArrays.moderate} />
            </InfoCard>
            </Grid>
            <Grid item xs={3}>
            <InfoCard title="Low">
              <VulnList vulns={testArrays.low} />
            </InfoCard>
            </Grid>
        </Grid>
    </div> 
  );
};