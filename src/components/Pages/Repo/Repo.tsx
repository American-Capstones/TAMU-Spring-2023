import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import {
  InfoCard, 
} from '@backstage/core-components';
import { VulnList } from '../../VulnList';
import { RepoVulns } from '../../../utils/types';
import { getVulnerabilitiesFromRepo } from '../../../api/getVulnerabilitiesFromRepo';
import { sortVulnData } from '../../../utils/functions';

export const Repo = ({  }: { }) => {
    const { repoName } = useParams();
    const [ repoInfo, setRepoInfo ] = useState<RepoVulns>({
        critical: [],
        high: [],
        moderate: [],
        low: [],
    })

    if (repoName)
        getVulnerabilitiesFromRepo(repoName, 'Baggage-Claim-Incorporated')
        .then((data) => {
            setRepoInfo(sortVulnData(data))
        })

    return (
        <div>
            <h1>Repository Vulnerabilities</h1>
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