import React from 'react';
import { useState } from 'react';
import { InputLabel, FormControl, Select, MenuItem } from '@material-ui/core';
import { useGetOrgsForUser } from '../../../hooks/useGetOrgsForUser';
import { useNavigate } from "react-router-dom";
import { Error } from '../../Pages/Error';

export const SelectOrg = ({ defaultOption = '' } : { defaultOption?: string }) => {
    const [ selectValue, setSelectValue ] = useState<string>(defaultOption);
    let { loading, orgs, error } = useGetOrgsForUser();
    const navigate = useNavigate();

    let handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event?.target as HTMLSelectElement;
        const newOrg = target.value;
        
        setSelectValue(newOrg);
        
        if (newOrg && newOrg != '') {
            navigate(`../${newOrg}`, { replace: true });
        }
    }

    if (error) {
        return <Error message={error.message}/>
    }
  

    return (
        <FormControl style={{width: 200, paddingBottom: 30 }}>
            <InputLabel>Organization Name</InputLabel>
            <Select
                label="Organization Name"
                value={selectValue ?? ''}
                onClick={handleClick}
            >
            <MenuItem value={''} className={'item'} disabled={selectValue != ''}><em>None</em></MenuItem>
                {orgs?.map((org, index) => {
                    return (
                        <MenuItem key={index} value={org} className={'item'}>{org}</MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
};
