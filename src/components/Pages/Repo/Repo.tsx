import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Divider, Grid } from '@material-ui/core';
import { getVulnerabilitiesFromRepo } from '../../../api/getVulnerabilitiesFromRepo';
import { sortVulnData } from '../../../utils/functions';
import { RepoVulns } from '../../../utils/types';
import {
  HorizontalScrollGrid,
  InfoCard,
  StatusOK,
} from '@backstage/core-components';
import { VulnList } from '../../VulnList';
import { Skeleton } from '@material-ui/lab';

const columnStyle : React.CSSProperties = {
  marginRight: "4em",
  display: "flex",
  flexDirection: "column",
  minWidth: "25em",
  maxWidth: "25em"
}

export const Repo = ({ }: {}) => {

  const { repoName } = useParams();
  const [loadingState, setLoadingState] = useState<Boolean>(true);
  const [repoInfo, setRepoInfo] = useState<RepoVulns>({
    critical: [],
    high: [],
    moderate: [],
    low: [],
  })

  if (repoName)
    getVulnerabilitiesFromRepo(repoName, 'Baggage-Claim-Incorporated')
      .then((data) => {
        setRepoInfo(sortVulnData(data));
        setLoadingState(false);
      })
  return (
    <div style={{
      width: "100%",
      height: "100%"
    }}>
      <h1>Repository Vulnerabilities</h1>
      <div style={{
        display: 'flex',
        flexDirection: 'row'
      }}>
        <div title="Critical" style={columnStyle}>
          <h3>Critical Vulnerabilities</h3>
          {loadingState == true &&
            <Skeleton variant='rect' width={"100%"} height={"10em"}/>
          }
          <VulnList vulns={repoInfo.critical}/>
        </div>
        <div title="High" style={columnStyle}>
          <h3>High Vulnerabilities</h3>
          {loadingState == true &&
            <Skeleton variant='rect' width={"100%"} height={"10em"}/>
          }
          <VulnList vulns={repoInfo.high}/>
        </div>
        <div title="Moderate" style={columnStyle}>
          <h3>Moderate Vulnerabilities</h3>
          {loadingState == true &&
            <Skeleton variant='rect' width={"100%"} height={"10em"}/>
          }
          <VulnList vulns={repoInfo.moderate}/>
        </div>
        <div title="Low" style={columnStyle}>
          <h3>Low Vulnerabilities</h3>
          {loadingState == true &&
            <Skeleton variant='rect' width={"100%"} height={"10em"}/>
          }
          <VulnList vulns={repoInfo.low}/>
        </div>
      </div>
    </div>
  );
};
