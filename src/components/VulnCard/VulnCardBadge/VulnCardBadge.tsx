import { Tooltip } from '@material-ui/core';
import { green, grey, red } from '@material-ui/core/colors';
import { SecurityOutlined, VerifiedUserOutlined } from '@material-ui/icons'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import React from 'react';

/* Conditional logic to render correct badge */
/*  Input: status: string
*   Output: JSX/React Componenet
*/
type VulnCardBadgeProps = {
    state: string,
    severity: string
}

export const VulnCardBadge = (props: VulnCardBadgeProps) => {

    const severityColors = (severity: string) => {
        switch (severity.toUpperCase()) {
            case "CRITICAL":
                return "#3B1F2B";
            case "HIGH":
                return "#C73E1D";
            case "MODERATE":
                return "#F18F01";
            case "LOW":
                return "#2A4F87";
            case "UNKNOWN":
                return grey[500];
        }
    }

    const severityColor = severityColors(props.severity);

    if (props.state === undefined) {
        return (
            <></>
        )
    }
    else {
        switch (props.state.toUpperCase()) {
            case "OPEN":
                return (
                    <Tooltip title="Open Vulnerability">
                        <SecurityOutlined style={{ color: severityColor} } />
                    </Tooltip>
                );
            case "FIXED":
                return (
                    <Tooltip title="Fixed">
                        <VerifiedUserOutlined style={{ color: severityColor }} />
                    </Tooltip>
                );
            case "DISMISSED":
                return (
                    <Tooltip title="Dismissed">
                        <VerifiedUserIcon style={{ color: severityColor }} />
                    </Tooltip>
                );
        }
        return (
            <></>
        )
    }
}
