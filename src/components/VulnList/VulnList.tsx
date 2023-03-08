import { Typography, Grid, Chip, Card, CardContent, CardHeader, Accordion, AccordionSummary, AccordionDetails, Tooltip, Icon, Avatar, SvgIcon } from '@material-ui/core';
import { SecurityOutlined, VerifiedUserOutlined, ExpandMore } from '@material-ui/icons'
import React from "react";
import { VulnListProps } from "./Types";
import { green, grey, deepPurple } from '@material-ui/core/colors';


/* Conditional logic to render correct badge */
function Badge(status: string) {
  switch (status) {
    case "OPEN":
      return (
        <Tooltip title="Open Vulnerability">
          <SecurityOutlined style={{ color: grey[600] }} />
        </Tooltip>
      );
    case "FIXED":
      return (
        <Tooltip title="Fixed">
          <VerifiedUserOutlined style={{ color: grey[600] }} />
        </Tooltip>
      );
    case "DISMISSED":
      return (
        <Tooltip title="Dismissed">
          <SecurityOutlined style={{ color: grey[600] }} />
        </Tooltip>
      );
  }
  return (
    <></>
  )
}

export const VulnList = ({ vulns }: VulnListProps) => {
  return (
    <Grid container spacing={4}>{vulns.map((vuln, index) =>
      <Grid item xs={12} style={{
        width: "28em"
      }}>
        <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <div style={{ marginRight: "1em" }}>
              {Badge(vuln.state.toUpperCase())}
            </div>
            <div style={{ marginRight: "1em" }}>
              <Typography variant='button'>{vuln.packageName + " " + vuln.versionNum}</Typography>
              <Typography style={{fontWeight: "normal", color: grey[600]}} variant='subtitle2'>{"Created "} <span style={{fontWeight: "bolder"}}>{vuln.createdAt}</span></Typography>

            </div>
            <div>
              <Chip
                style={{
                color: 'white',
                fontWeight: 'bolder',
                background: deepPurple[500]
              }} label={"PR"} />
            </div>
          </AccordionSummary>
          <AccordionDetails style={{marginLeft: "2em"}}>
            <Typography>
              <Typography>{vuln.summary}</Typography>
              <Typography>Pull Request: {vuln.pullRequest}</Typography>
              <Typography>Dismissed at: {vuln.dismissedAt}</Typography>
              <Typography>Fixed at: {vuln.fixedAt}</Typography>
              <Typography>Version Range: {vuln.vulnVersionRange}</Typography>
              <Typography>Classification: {vuln.classification}</Typography>
              <Typography>Vulnerability Count: {vuln.vulnerabilityCount}</Typography>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Grid>
    )}
    </Grid>
  )
}
