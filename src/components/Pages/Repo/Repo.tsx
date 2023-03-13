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
    // This state variable isn't very representative of the information it's storing for the UI.
    // Really this is being used when filling out the VulnList's. 
    // So maybe call it "shownRepoVulns" or "activeVulns" or something like that
    const [ repoInfo, setRepoInfo ] = useState<RepoVulns>(defaultValues);
    // I like this just fine, think it makes sense given it's context.
    const [ allRepoInfo, setAllRepoInfo ] = useState<RepoVulns>(defaultValues);

    if (repoName && repoInfo == defaultValues) {
        // This call should only have to be made once, and you can call each set function in the then() fn
        getVulnerabilitiesFromRepo(repoName, 'Baggage-Claim-Incorporated')
        .then((data) => {
            setRepoInfo(sortVulnData(data))
        })
        getVulnerabilitiesFromRepo(repoName, 'Baggage-Claim-Incorporated')
        .then((data) => {
            setAllRepoInfo(sortVulnData(data))
        })
    }

    // Probably best for this to have a more descriptive name, maybe "openVulns"?
    const newObject = {
      critical: repoInfo.critical.filter(vuln => vuln.state.toLowerCase() == "open"),
      high: repoInfo.high.filter(vuln => vuln.state.toLowerCase() == "open"),
      moderate: repoInfo.moderate.filter(vuln => vuln.state.toLowerCase() == "open"),
      low: repoInfo.low.filter(vuln => vuln.state.toLowerCase() == "open"),
    }
    
    const openFilter = (event: React.FormEvent<HTMLInputElement>) => {
      const target = event.target as HTMLInputElement;
      // I think both of these conditionals might be trying to say
      // "if (switch_state) then set active vulns to ____"
      // so you probably want to sub each of the ___ values 
      // instead of "repoInfo" in these if statements.
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