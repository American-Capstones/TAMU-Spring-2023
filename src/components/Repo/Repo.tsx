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
      classification: "none",
      severity: "critical",
      summary: "vuln",
      vulnerabilityCount: [1, 2, 3],
      state: "resolved",
    } 
  ], 
  high: [], 
  moderate: [],
  low: []
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