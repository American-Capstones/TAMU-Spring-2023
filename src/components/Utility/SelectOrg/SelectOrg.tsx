import React from 'react';
import { useState } from 'react';
import { InputLabel, FormControl, Select, MenuItem } from '@material-ui/core';
import { useGetOrgsForUser } from '../../../api/useGetOrganizationsForUser';
import { formatOrgData } from '../../../utils/functions';
import { Org } from '../../../utils/types';
import { useNavigate } from "react-router-dom";

export const SelectOrg = ({ defaultOption = '' } : { defaultOption?: string }) => {
    const defaultValues: string[] = [];
    const [ orgs, setOrgs ] = useState<string[]>(defaultValues);
    const [ selectValue, setSelectValue ] = useState<string>(defaultOption);
    const navigate = useNavigate();

    if (orgs == defaultValues){
        useGetOrgsForUser(10).then((data: Org[]) => {
            const existingData = data.filter(x => x.name != '');
            setOrgs(formatOrgData(existingData));
        })
    }

    let handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event?.target as HTMLSelectElement;
        const newOrg = target.value;
        
        setSelectValue(newOrg);
        
        if (newOrg && newOrg != '') {
            navigate(`./${newOrg}`, { replace: true });
        }
    }

    return (
        <FormControl style={{width: 200, paddingBottom: 30 }}>
            <InputLabel>Organization Name</InputLabel>
            <Select
                label="Organization Name"
                value={selectValue}
                onClick={handleClick}
            >
            <MenuItem value={''} className={'item'}><em>None</em></MenuItem>
                {orgs?.map((org, index) => {
                    return (
                        <MenuItem key={index} value={org} className={'item'}>{org}</MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
};
