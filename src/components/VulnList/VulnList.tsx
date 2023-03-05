import { InfoCard } from "@backstage/core-components";
import React from "react";
import { VulnListProps } from "./Types";

export const VulnList = ({vulns}: VulnListProps) => {
  return (
    <>{vulns.map((vuln, index) => 
      <InfoCard key={index}>
        <h1>{vuln.packageName} {vuln.versionNum}</h1>
        <p>State: {vuln.state}</p>
        <p>Created at: {vuln.createdAt}</p>
        <p>Pull Request: {vuln.pullRequest}</p>
        <p>Dismissed at: {vuln.dismissedAt}</p>
        <p>Fixed at: {vuln.fixedAt}</p>
        <p>Version Range: {vuln.vulnVersionRange}</p>
        <p>Classification: {vuln.classification}</p>
        <p>Summary: {vuln.summary}</p>
        <p>Vulnerability Count: {vuln.vulnerabilityCount}</p>
      </InfoCard>
    )}
    </>
  )
}