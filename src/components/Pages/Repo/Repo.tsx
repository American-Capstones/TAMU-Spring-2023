import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, FormControlLabel, Switch, SwitchProps } from '@material-ui/core';
import {
  InfoCard, 
} from '@backstage/core-components';
import { VulnList } from '../../VulnList';
import { RepoVulns, VulnInfoFormatted } from '../../../utils/types';
import ReactLoading from "react-loading";
import { useGetVulnsFromRepo } from '../../../hooks/useGetVulnsFromRepo';

export const Repo = ({  }: { }) => {
    const { orgName, repoName } = useParams();
    const { loading, vulnInfo: vulns } = useGetVulnsFromRepo(repoName, orgName);
    const [ shownRepoVulns, setShownRepoVulns ] = useState<RepoVulns>();
    const [ openVulns, setOpenVulns ] = useState<RepoVulns>();

    useEffect(() => {
        if (vulns) {
            setShownRepoVulns(vulns);
            setOpenVulns({
                critical: vulns.critical.filter(vuln => vuln.state.toLowerCase() == "open"),
                high: vulns.high.filter(vuln => vuln.state.toLowerCase() == "open"),
                moderate: vulns.moderate.filter(vuln => vuln.state.toLowerCase() == "open"),
                low: vulns.low.filter(vuln => vuln.state.toLowerCase() == "open"),
            })
        }
    }, [vulns]);
    
    const openFilter = (event: React.FormEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;
        
        if (target.checked) {
            setShownRepoVulns(openVulns);
        } else if (!target.checked){
            setShownRepoVulns(vulns);
        }
    }

    if (loading || !shownRepoVulns) {
        return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}> <ReactLoading 
            type={"spin"}
            color={"#8B0000"}
            height={100}
            width={100}
        />
        </div>
    }
    
    return (
        <div>
            <h1>{repoName}</h1>
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