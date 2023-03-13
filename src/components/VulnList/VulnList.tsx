import { InfoCard } from "@backstage/core-components";
import { Typography } from '@material-ui/core';
import React from "react";
import { VulnListProps } from "../../utils/types";

export const VulnList = ({vulns}: VulnListProps) => {
    const notFound = "NOT FOUND";
    return (
        <>
        {vulns.map((vuln, index) => 
            <InfoCard key={index}>
                <h1>{vuln.packageName ?? notFound} - {vuln.versionNum ?? notFound}</h1>
                <Typography>{vuln.state ?? notFound}</Typography>
                <Typography>{vuln.summary ?? notFound}</Typography>
                <Typography>Created at: {vuln.createdAt ?? notFound}</Typography>
                <Typography>Pull Request: {vuln.pullRequest ?? notFound}</Typography>
                <Typography>Dismissed at: {vuln.dismissedAt ?? notFound}</Typography>
                <Typography>Fixed at: {vuln.fixedAt ?? notFound}</Typography>
                <Typography>Version Range: {vuln.vulnVersionRange ?? notFound}</Typography>
                <Typography>Classification: {vuln.classification ?? notFound}</Typography>
                <Typography>Vulnerability Count: {vuln.vulnerabilityCount ?? notFound}</Typography>
            </InfoCard>
        )}
        </>
    )
}