import { Grid } from '@material-ui/core';
import React from "react";
import { VulnListProps } from "../../utils/types";
import { VulnCard } from '../VulnCard';

// React Functional Component
export const VulnList = ({ vulns }: VulnListProps) => {
  return (
    <Grid container spacing={4}>{vulns.map((vuln) =>
      <Grid item xs={12} style={{
        width: "28em"
      }}>
        <VulnCard vuln={vuln}/>
      </Grid>
    )}
    </Grid>
  )
}
