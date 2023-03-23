import React from 'react';
import { useState } from 'react';
import { InputLabel, FormControl, Select, MenuItem } from '@material-ui/core';
import { useGetOrgsForUser } from '../../../hooks/useGetOrgsForUser';
import { useNavigate } from "react-router-dom";

type SelectScopeProps = {
    handleClick: (event: React.MouseEvent<HTMLDivElement>) => void,
    title: string,
    defaultOption?: string
}

export const SelectScope = ({ handleClick, title, defaultOption = '' } : SelectScopeProps) => {

    return (
        <FormControl style={{width: 200, paddingBottom: 30 }}>
            <InputLabel>{title}</InputLabel>
            <Select
                label={title}
                value={defaultOption ?? ''}
                onClick={handleClick}
            >
                <MenuItem value={'teams'} className={'item'}>Teams</MenuItem>
                <MenuItem value={'organization'} className={'item'}>Organization</MenuItem>
            </Select>
        </FormControl>
    );
};
