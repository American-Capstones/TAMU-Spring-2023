import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormControlLabel, Input, Switch } from '@material-ui/core';
import { RepoVulns } from '../../../utils/types';
import { VulnList } from '../../VulnList';
import { useGetVulnsFromRepo } from '../../../hooks/useGetVulnsFromRepo';
import { Skeleton } from '@material-ui/lab';
import { HorizontalScrollGrid } from '@backstage/core-components';
import CircleIcon from '@mui/icons-material/Circle';
import { severityColors } from '../../../utils/functions';

const columnStyle: React.CSSProperties = {
    marginRight: "4em",
    display: "flex",
    flexDirection: "column",
    minWidth: "25em",
    maxWidth: "25em"
}

export const Repo = ({ }: {}) => {
    const { orgName, repoName, teamName, topicName } = useParams();
    const { loading, vulnInfo: vulns, error } = useGetVulnsFromRepo(repoName, orgName);
    const [shownRepoVulns, setShownRepoVulns] = useState<RepoVulns>();
    const [openVulns, setOpenVulns] = useState<RepoVulns>();
    const navigate = useNavigate();

    const searchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;
        const search = target.value.toLowerCase();
        if (vulns) {
            const filteredVulns: RepoVulns = {
                critical: vulns.critical.filter(vuln => vuln.packageName.toLowerCase().includes(search)),
                high: vulns.high.filter(vuln => vuln.packageName.toLowerCase().includes(search)),
                moderate: vulns.moderate.filter(vuln => vuln.packageName.toLowerCase().includes(search)),
                low: vulns.low.filter(vuln => vuln.packageName.toLowerCase().includes(search)),
            }
            setShownRepoVulns(filteredVulns);
        }
    }

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
        } else if (!target.checked) {
            setShownRepoVulns(vulns);
        }
    }

    if (error) {
        const currentLocation = window.location.href;
        if (currentLocation.includes("team")) {
            navigate(`../${orgName}/team/${teamName}`, { state: error.message, replace: false });
        } else if (currentLocation.includes("topic")) {
            navigate(`../${orgName}/topic/${topicName}`, { state: error.message, replace: false });
        }
    }

    return (
        <div style={{
            width: "100%",
            height: "100%"
        }}>
            <h1 style={{ fontSize: '32px' }}>{repoName}</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex' }}>
                    <p style={{ marginRight: '1em', fontSize: '16px' }}>Open Only</p>
                    <FormControlLabel control={<Switch onChange={openFilter} />} label=""/>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Input placeholder="Search" onChange={searchChange} style={{ height: '2em', width: '20em' }}/>
                </div>
            </div>
            <HorizontalScrollGrid>
                <div style={{
                    padding: "1.24rem",
                    display: "flex",
                    flexDirection: "row"
                }}>
                    <div title="Critical" style={columnStyle}>
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: ".64rem"
                        }}>
                            <CircleIcon sx={{ fontSize: '.72em' }} style={{ color: severityColors('critical') }} />
                            <h3>Critical Vulnerabilities</h3>
                        </div>
                        {loading &&
                            <Skeleton variant='rect' width={"100%"} height={"60vh"} />
                        }
                        <VulnList vulns={shownRepoVulns?.critical} />
                    </div>
                    <div title="High" style={columnStyle}>
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: ".64rem"
                        }}>
                            <CircleIcon sx={{ fontSize: '.72em' }} style={{ color: severityColors('high') }} />
                            <h3>High Vulnerabilities</h3>
                        </div>
                        {loading &&
                            <Skeleton variant='rect' width={"100%"} height={"60vh"} />
                        }
                        <VulnList vulns={shownRepoVulns?.high} />
                    </div>
                    <div title="Moderate" style={columnStyle}>
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: ".64rem"
                        }}>
                            <CircleIcon sx={{ fontSize: '.72em' }} style={{ color: severityColors('moderate') }} />
                            <h3>Moderate Vulnerabilities</h3>
                        </div>
                        {loading &&
                            <Skeleton variant='rect' width={"100%"} height={"60vh"} />
                        }
                        <VulnList vulns={shownRepoVulns?.moderate} />
                    </div>
                    <div title="Low" style={columnStyle}>
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: ".64rem"
                        }}>
                            <CircleIcon sx={{ fontSize: '.72em' }} style={{ color: severityColors('low') }} />
                            <h3>Low Vulnerabilities</h3>
                        </div>
                        {loading &&
                            <Skeleton variant='rect' width={"100%"} height={"60vh"} />
                        }
                        <VulnList vulns={shownRepoVulns?.low} />
                    </div>
                </div>
            </HorizontalScrollGrid>
        </div>
    );
}