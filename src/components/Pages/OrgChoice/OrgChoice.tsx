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
            { location.state != undefined &&
                <Alert severity='error'>{location.state}</Alert>
            }
            <SelectOrg/>
        </div>
    );
};
