import React from 'react';
import { useState } from 'react';
import { InputLabel, FormControl, Select, MenuItem } from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import { GroupIcon } from '@backstage/core-components';
import TagIcon from '@mui/icons-material/Tag';
import SourceIcon from '@mui/icons-material/Source';

type SelectScopeProps = {
    handleClick: (newScope: string) => void,
    title: string,
    defaultOption?: string
}

export const SelectScope = ({ handleClick, title, defaultOption = '' }: SelectScopeProps) => {
    const [selectValue, setSelectValue] = useState<string>(defaultOption);

    let onClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event?.target as HTMLSelectElement;
        const newScope = target.value;
        setSelectValue(newScope);
        handleClick(newScope);
    }

    const handleSelect = (event: React.MouseEvent, newValue : string) => {
        if (newValue !== null) {
          setSelectValue(newValue);
          handleClick(newValue);
        }
      };

    return (
        <ToggleButtonGroup
            value={selectValue}
            exclusive
            onChange={handleSelect}
            aria-label="scope select"
        >
            <ToggleButton value="teams" aria-label="teams">
                <GroupIcon/>
                <span style={{marginLeft: '.48rem'}}>Teams</span>
            </ToggleButton>
            <ToggleButton value="topics" aria-label="topics">
                <TagIcon/>
                <span style={{marginLeft: '.48rem'}}>Topics</span>
            </ToggleButton>
            <ToggleButton value="repositories" aria-label="repositories">
                <SourceIcon/>
                <span style={{marginLeft: '.48rem'}}>Repositories</span>
            </ToggleButton>
        </ToggleButtonGroup>
    );
};
