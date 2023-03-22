import { Grid } from '@material-ui/core';
import React from "react";
import { VulnListProps } from "../../utils/types";
import { VulnCard } from '../VulnCard';

// React Functional Component
export const VulnList = ({ vulns }: VulnListProps) => {
  return (
    <>
    {vulns &&
        <Grid container spacing={4}>
            {vulns.map((vuln, index) =>
                <Grid key={index} item xs={12} style={{
                    width: "28em"
                }}>
                    <VulnCard vuln={vuln}/>
                </Grid>
            )}
        </Grid>
    }
    </>
  )
}
