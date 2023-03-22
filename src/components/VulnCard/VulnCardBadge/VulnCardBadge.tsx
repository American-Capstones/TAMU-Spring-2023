import { Tooltip } from '@material-ui/core';
import { green, grey } from '@material-ui/core/colors';
import { SecurityOutlined, VerifiedUserOutlined } from '@material-ui/icons'
import React from 'react';

/* Conditional logic to render correct badge */
/*  Input: status: string
*   Output: JSX/React Componenet
*/
type VulnCardBadgeProps = {
    state: string
}

export const VulnCardBadge = (props: VulnCardBadgeProps) => {
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
                        <SecurityOutlined style={{ color: grey[600] }} />
                    </Tooltip>
                );
            case "FIXED":
                return (
                    <Tooltip title="Fixed">
                        <VerifiedUserOutlined style={{ color: green[600] }} />
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
}
