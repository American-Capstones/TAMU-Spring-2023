import React, { useEffect } from 'react';
import { useState } from 'react';
import { Box, TextField } from '@material-ui/core';
import { useGetOrgsForUser } from '../../../hooks/useGetOrgsForUser';
import { useNavigate } from "react-router-dom";
import { Error } from '../../Pages/Error';
import { Autocomplete } from '@mui/material';
import { Org } from '../../../utils/types';

export const SelectOrg = ({ defaultOption = '' }: { defaultOption?: string }) => {
    const [selectValue, setSelectValue] = useState<Org | null>(null);
    let { loading, orgs, error } = useGetOrgsForUser();
    const navigate = useNavigate();

    // We decided to pass the Organization name as a browser parameter, but there is nowhere to grab the rest of the Org
    // object. The AutoComplete selectValue takes type Org | null, so to bypass, I created a useEffect hook that will
    // attempt to map the Organization string name to the Org object. If found, it will set the default selectValue to such.
    useEffect(() => {
        if (!loading && orgs.length > 0) {
            const org = orgs.find((org) => org.name === defaultOption);
            if (org) {
                setSelectValue(org);
            }
        }
    }, [loading])

    if (error) {
        return <Error message={error.message}/>
    }

    return (
        <>
            <Autocomplete
                autoHighlight
                id="combo-box-demo"
                options={orgs}
                getOptionLabel={(option) => option.name}
                onChange={(event: any, newValue) => {
                    setSelectValue(newValue)
                    if (newValue === null) {
                        navigate('../');
                    }
                    if (newValue != null) {
                        navigate(`../${newValue?.name}`, { replace: true });
                    }
                }}
                value={selectValue}
                loading={loading}
                // Overriding component style to make scope dropdown somewhat repsonsive.
                sx={{ minWidth: 60, maxWidth: 300 }}
                // This is what allows the GitHub avatar to be displayed in the dropdown.
                renderOption={(props, option) => (
                    <Box component="li"{...props}>
                        <img
                            loading="lazy"
                            width="20"
                            src={option.avatarUrl}
                            srcSet={option.avatarUrl}
                            alt={`${option.name} avatar`}
                            style={{ marginRight: '1.24rem' }}
                        />
                        {option.name}
                    </Box>
                )}
                renderInput={(params) => <>
                    <TextField variant='outlined' {...params} label="Organization" />
                </>}
            />
        </>
    );
};
