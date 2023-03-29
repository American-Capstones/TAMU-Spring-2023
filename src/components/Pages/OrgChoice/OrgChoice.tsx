import React from 'react';
import { SelectOrg } from '../../Utility';
import { useLocation } from "react-router-dom";
import { Alert } from '@mui/material';

export const OrgChoice = ({} : {}) => {
    const location = useLocation();
    
    return (
        <>
            { location.state != undefined && 
                <Alert severity='error'>{location.state}</Alert>
            }
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
            }}>
                
                <h1>Please select an organization to continue:</h1>
                <SelectOrg />
            </div>
        </>
    );
};
