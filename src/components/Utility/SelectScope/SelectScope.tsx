import React from 'react';
import { useState } from 'react';
import { InputLabel, FormControl, Select, MenuItem } from '@material-ui/core';

type SelectScopeProps = {
    handleClick: (newScope: string) => void,
    title: string,
    defaultOption?: string
}

export const SelectScope = ({ handleClick, title, defaultOption = '' } : SelectScopeProps) => {
    const [ selectValue, setSelectValue ] = useState<string>(defaultOption);

    let onClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event?.target as HTMLSelectElement;
        const newScope = target.value;
        
        setSelectValue(newScope);

        handleClick(newScope);
    }

    return (
        <FormControl style={{width: 200, paddingBottom: 30 }}>
            <InputLabel>{title}</InputLabel>
            <Select
                label={title}
                value={selectValue ?? ''}
                onClick={onClick}
            >
                <MenuItem value={'teams'} className={'item'}>Teams</MenuItem>
                <MenuItem value={'topics'} className={'item'}>Topics</MenuItem>
                <MenuItem value={'repositories'} className={'item'}>Repositories</MenuItem>
            </Select>
        </FormControl>
    );
};
