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
    if (repoName == ":repoName") {
      alert("Not a valid repository.");
    }
    const defaultValues = {critical: [], high: [], moderate: [], low: []}
    const [ shownRepoVulns, setShownRepoVulns ] = useState<RepoVulns>(defaultValues);
    const [ allRepoInfo, setAllRepoInfo ] = useState<RepoVulns>(defaultValues);

    if (repoName && shownRepoVulns == defaultValues) {
        getVulnerabilitiesFromRepo(repoName, 'Baggage-Claim-Incorporated')
        .then((data) => {
            const sortedData = sortVulnData(data);
            setShownRepoVulns(sortedData);
            setAllRepoInfo(sortedData);
        })
    }

    const openVulns = {
      critical: allRepoInfo.critical.filter(vuln => vuln.state.toLowerCase() == "open"),
      high: allRepoInfo.high.filter(vuln => vuln.state.toLowerCase() == "open"),
      moderate: allRepoInfo.moderate.filter(vuln => vuln.state.toLowerCase() == "open"),
      low: allRepoInfo.low.filter(vuln => vuln.state.toLowerCase() == "open"),
    }
    
    const openFilter = (event: React.FormEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;

        if (target.checked) {
            setShownRepoVulns(openVulns);
        } else if (!target.checked){
            setShownRepoVulns(allRepoInfo);
        }
    }
    
    return (
        <div>
            <h1>Repository Vulnerabilities</h1>
            <FormControlLabel control={<Switch onChange={openFilter} />} label="Open Only" />
            <Grid container spacing={1}>
                <Grid item xs={3}>
                    <InfoCard title="Critical">
                        <VulnList vulns={shownRepoVulns.critical} />
                    </InfoCard>
                </Grid>
                <Grid item xs={3}>
                    <InfoCard title="High">
                        <VulnList vulns={shownRepoVulns.high} />
                    </InfoCard>
                </Grid>
                <Grid item xs={3}>
                    <InfoCard title="Moderate">
                        <VulnList vulns={shownRepoVulns.moderate} />
                    </InfoCard>
                </Grid>
                <Grid item xs={3}>
                    <InfoCard title="Low">
                        <VulnList vulns={shownRepoVulns.low} />
                    </InfoCard>
                </Grid>
            </Grid>
        </div> 
    );
};