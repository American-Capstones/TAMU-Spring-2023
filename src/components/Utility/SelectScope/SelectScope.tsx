import React, { useContext } from 'react';
import { useState } from 'react';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import { GroupIcon } from '@backstage/core-components';
import TagIcon from '@mui/icons-material/Tag';
import SourceIcon from '@mui/icons-material/Source';
import { ScopeContext } from '../../Root/Root';

type SelectScopeProps = {
  handleClick: (newScope: string) => void;
  defaultOption?: string;
};

export const SelectScope = ({ handleClick, defaultOption = '' }: SelectScopeProps) => {
  const [selectValue, setSelectValue] = useState<string>(defaultOption);
  const { setScope } = useContext(ScopeContext);

  const handleSelect = (event: React.MouseEvent, newValue: string) => {
    if (newValue !== null) {
      setSelectValue(newValue);
      setScope(newValue);
      handleClick(newValue);
    }
  };

  return (
    <ToggleButtonGroup value={selectValue} exclusive onChange={handleSelect} aria-label="scope select">
      <ToggleButton value="teams" aria-label="teams">
        <GroupIcon />
        <span style={{ marginLeft: '.48rem' }}>Teams</span>
      </ToggleButton>
      <ToggleButton value="topics" aria-label="topics">
        <TagIcon />
        <span style={{ marginLeft: '.48rem' }}>Topics</span>
      </ToggleButton>
      <ToggleButton value="repositories" aria-label="repositories">
        <SourceIcon />
        <span style={{ marginLeft: '.48rem' }}>Repositories</span>
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
