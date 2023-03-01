import { InfoCard } from "@backstage/core-components";
import React from "react";
import { VulnListProps } from "./Types";

export const VulnList = ({vulns}: VulnListProps) => {
  return (
    <>{vulns.map((vuln, index) => 
      <InfoCard key={index}>
        {vuln.packageName}
        {vuln.versionNum}
      </InfoCard>
    )}
    </>
  )
}