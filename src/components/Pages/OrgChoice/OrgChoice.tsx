import React from 'react';
import { SelectOrg } from '../../Utility';
import { useLocation } from "react-router-dom";
import { Alert } from '@mui/material';

export const OrgChoice = ({ }: {}) => {
    const location = useLocation();

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column'
        }}>
            { location.state != undefined && location.state.error &&
                <Alert severity='error'>{location.state.error}</Alert>
            }
            <SelectOrg/>
        </div>
    );
};
