import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormControlLabel, Switch } from '@material-ui/core';
import { VulnList } from '../../VulnList';
import { RepoVulns } from '../../../utils/types';
import ReactLoading from "react-loading";
import { useGetVulnsFromRepo } from '../../../hooks/useGetVulnsFromRepo';

const columnStyle : React.CSSProperties = {
    marginRight: "4em",
    display: "flex",
    flexDirection: "column",
    minWidth: "25em",
    maxWidth: "25em"
  }

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
            <div title="Critical" style={columnStyle}>
                <h3>Critical Vulnerabilities</h3>
                {loading &&
                    <Skeleton variant='rect' width={"100%"} height={"10em"}/>
                }
                <VulnList vulns={shownRepoVulns.critical}/>
            </div>
            <div title="High" style={columnStyle}>
                <h3>High Vulnerabilities</h3>
                {loading &&
                    <Skeleton variant='rect' width={"100%"} height={"10em"}/>
                }
                <VulnList vulns={shownRepoVulns.high}/>
            </div>
            <div title="Moderate" style={columnStyle}>
                <h3>Moderate Vulnerabilities</h3>
                {loading &&
                    <Skeleton variant='rect' width={"100%"} height={"10em"}/>
                }
                <VulnList vulns={shownRepoVulns.moderate}/>
            </div>
            <div title="Low" style={columnStyle}>
                <h3>Low Vulnerabilities</h3>
                {loading &&
                    <Skeleton variant='rect' width={"100%"} height={"10em"}/>
                }
                <VulnList vulns={shownRepoVulns.low}/>
            </div>
        </div> 
    );
};
import { Skeleton } from '@material-ui/lab';

