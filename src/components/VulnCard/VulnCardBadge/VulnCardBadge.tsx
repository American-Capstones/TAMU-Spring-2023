import { Tooltip } from '@material-ui/core';
import { SecurityOutlined, VerifiedUserOutlined } from '@material-ui/icons'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import React from 'react';
import { severityColors } from '../../../utils/functions';

/* Conditional logic to render correct badge */
/*  Input: status: string
*   Output: JSX/React Componenet
*/
type VulnCardBadgeProps = {
    state: string,
    severity: string
}

export const VulnCardBadge = (props: VulnCardBadgeProps) => {
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
                        <SecurityOutlined style={{ color: severityColor }} />
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
