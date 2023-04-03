import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormControlLabel, Switch } from '@material-ui/core';
import { RepoVulns, VulnInfoUnformatted } from '../../../utils/types';
import { VulnList } from '../../VulnList';
import { Error } from '../Error';
import ReactLoading from "react-loading";
import { useGetVulnsFromRepo } from '../../../hooks/useGetVulnsFromRepo';
import { Skeleton } from '@material-ui/lab';
import { HorizontalScrollGrid } from '@backstage/core-components';
import CircleIcon from '@mui/icons-material/Circle';

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
        // return <Error message={error.message}/>
    }

    if (loading) {
        return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}> <ReactLoading
            type={"spin"}
            color={"#8B0000"}
            height={100}
            width={100}
        />
        </div>
    }

    return (
        <div style={{
            width: "100%",
            height: "100%"
        }}>
            <h1>{repoName}</h1>
            <FormControlLabel control={<Switch onChange={openFilter} />} label="Open Only" />
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
                            <CircleIcon sx={{ fontSize: '.72em' }} style={{ color: "#3B1F2B" }} />
                            <h3>Critical Vulnerabilities</h3>
                        </div>
                        {loading &&
                            <Skeleton variant='rect' width={"100%"} height={"10em"} />
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
                            <CircleIcon sx={{ fontSize: '.72em' }} style={{ color: "#C73E1D" }} />
                            <h3>High Vulnerabilities</h3>
                        </div>
                        {loading &&
                            <Skeleton variant='rect' width={"100%"} height={"10em"} />
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
                            <CircleIcon sx={{ fontSize: '.72em' }} style={{ color: "#F18F01" }} />
                            <h3>Moderate Vulnerabilities</h3>
                        </div>
                        {loading &&
                            <Skeleton variant='rect' width={"100%"} height={"10em"} />
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
                            <CircleIcon sx={{ fontSize: '.72em' }} style={{ color: "#2A4F87" }} />
                            <h3>Low Vulnerabilities</h3>
                        </div>
                        {loading &&
                            <Skeleton variant='rect' width={"100%"} height={"10em"} />
                        }
                        <VulnList vulns={shownRepoVulns?.low} />
                    </div>
                </div>
            </HorizontalScrollGrid>
        </div>
    );
}
