import { InfoCard } from "@backstage/core-components";
import { Typography } from '@material-ui/core';
import React from "react";
import { VulnListProps } from "../../utils/types";

export const VulnList = ({vulns}: VulnListProps) => {
  return (
    <>{vulns.map((vuln, index) => 
      <InfoCard key={index}>
        <h1>{vuln.packageName} {vuln.versionNum}</h1>
        <Typography>{vuln.state}</Typography>
        <Typography>{vuln.summary}</Typography>
        <Typography>Created at: {vuln.createdAt}</Typography>
        <Typography>Pull Request: {vuln.pullRequest}</Typography>
        <Typography>Dismissed at: {vuln.dismissedAt}</Typography>
        <Typography>Fixed at: {vuln.fixedAt}</Typography>
        <Typography>Version Range: {vuln.vulnVersionRange}</Typography>
        <Typography>Classification: {vuln.classification}</Typography>
        <Typography>Vulnerability Count: {vuln.vulnerabilityCount}</Typography>
      </InfoCard>
    )}
    </>
  )
}