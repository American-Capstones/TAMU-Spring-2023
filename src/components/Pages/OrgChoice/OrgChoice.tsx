import React from 'react';
import { SelectOrg } from '../../SelectOrg';

export const OrgChoice = ({} : {}) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        }}>
            <h1>Please select an organization to continue:</h1>
            <SelectOrg />
        </div>
    );
};
