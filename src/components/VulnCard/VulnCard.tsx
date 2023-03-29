import React from "react";
import { VulnInfoFormatted } from "../../utils/types";
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Chip, Tooltip, Typography } from "@material-ui/core";
import { VulnCardBadge } from "./VulnCardBadge";
import { deepPurple, grey } from "@material-ui/core/colors";
import { format } from "timeago.js";
import { ExpandMore } from '@material-ui/icons'

/* Render UTC Date into Human Friendly
* Input: date: string
* Output: date in locale format: string
*/
function utcToHuman(date_string: string) {
    let date = new Date(date_string);
    return date.toLocaleString();
  }

type VulnCardProps = {
    vuln: VulnInfoFormatted
}

export const VulnCard = (props: VulnCardProps) => {
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%" }}>
                    <div style={{ marginRight: "1.72em", marginBottom: 0, marginTop: 0 }}>
                        <VulnCardBadge state={props.vuln.state} />
                    </div>
                    <div style={{ marginRight: "1.72em", marginBottom: 0, marginTop: 0 }}>
                        <div>
                            <Typography variant='button'>{props.vuln.packageName}</Typography>
                        </div>
                        <div>
                            <Typography variant='button'>{props.vuln.versionNum}</Typography>
                        </div>
                        <Tooltip title={utcToHuman(props.vuln.createdAt)}>
                            <Typography style={{ fontWeight: "normal", color: grey[600] }} variant='subtitle2'><span style={{ fontWeight: "bolder" }}>{format(props.vuln.createdAt)}</span></Typography>
                        </Tooltip>
                    </div>
                    <div style={
                        {
                            display: "flex",
                            flexDirection: "row",
                            marginLeft: "auto"
                        }
                    }>

                        {props.vuln.pullRequest &&
                            <Tooltip title='Pull Request'>
                                <Chip
                                    clickable
                                    style={{
                                        color: 'white',
                                        fontWeight: 'bolder',
                                        background: deepPurple[500]
                                    }} label={"PR"} />
                            </Tooltip>
                        }


                    </div>
                </div>
            </AccordionSummary>
            <AccordionDetails>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '.64rem'
                    }}
                >
                    <div>
                        <Chip variant='outlined' size='small' label={props.vuln.classification} />
                    </div>
                    <div>
                        <Typography>
                            <Typography>{props.vuln.summary}</Typography>
                            {props.vuln.dismissedAt &&
                                <Typography>Dismissed {format(props.vuln.dismissedAt)}</Typography>
                            }
                            {props.vuln.fixedAt &&
                                <Typography>Fixed {format(props.vuln.fixedAt)}</Typography>
                            }
                        </Typography>
                    </div>
                </div>

            </AccordionDetails>
            <AccordionActions>
                <Button href={props.vuln.url} color='primary'>View on GitHub </Button>
            </AccordionActions>
        </Accordion>
    )
}
