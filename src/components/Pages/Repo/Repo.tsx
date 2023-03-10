import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, FormControlLabel, Switch, SwitchProps } from '@material-ui/core';
import {
  InfoCard, 
} from '@backstage/core-components';
import { VulnList } from '../../VulnList';
import { RepoVulns } from '../../../utils/types';
import { getVulnerabilitiesFromRepo } from '../../../api/getVulnerabilitiesFromRepo';
import { sortVulnData } from '../../../utils/functions';

export const Repo = ({  }: { }) => {
    const { repoName } = useParams();
    const defaultValues = {critical: [], high: [], moderate: [], low: []}
    const [ repoInfo, setRepoInfo ] = useState<RepoVulns>(defaultValues);
    const [ allRepoInfo, setAllRepoInfo ] = useState<RepoVulns>(defaultValues);

    if (repoName && repoInfo != defaultValues) {
        getVulnerabilitiesFromRepo(repoName, 'Baggage-Claim-Incorporated')
        .then((data) => {
            setRepoInfo(sortVulnData(data))
        })
        getVulnerabilitiesFromRepo(repoName, 'Baggage-Claim-Incorporated')
        .then((data) => {
            setAllRepoInfo(sortVulnData(data))
        })
      }

    const newObject = {
      critical: repoInfo.critical.filter(vuln => vuln.state.toLowerCase() == "open"),
      high: repoInfo.high.filter(vuln => vuln.state.toLowerCase() == "open"),
      moderate: repoInfo.moderate.filter(vuln => vuln.state.toLowerCase() == "open"),
      low: repoInfo.low.filter(vuln => vuln.state.toLowerCase() == "open")
    }
    
    const openFilter = (event: React.FormEvent<HTMLInputElement>) => {
      const target = event.target as HTMLInputElement;
      if (target.checked && repoInfo) {
        setRepoInfo(newObject);
      } else if (!target.checked && repoInfo){
        setRepoInfo(allRepoInfo);
      }

      
    }


    return (
        <div>
            <h1>Repository Vulnerabilities</h1>
            <FormControlLabel control={<Switch onChange={openFilter} />} label="Open Only" />
            <Grid container spacing={1}>
                <Grid item xs={3}>
                    <InfoCard title="Critical">
                        <VulnList vulns={repoInfo.critical} />
                    </InfoCard>
                </Grid>
                <Grid item xs={3}>
                    <InfoCard title="High">
                        <VulnList vulns={repoInfo.high} />
                    </InfoCard>
                </Grid>
                <Grid item xs={3}>
                    <InfoCard title="Moderate">
                        <VulnList vulns={repoInfo.moderate} />
                    </InfoCard>
                </Grid>
                <Grid item xs={3}>
                    <InfoCard title="Low">
                        <VulnList vulns={repoInfo.low} />
                    </InfoCard>
                </Grid>
            </Grid>
        </div> 
    );
};