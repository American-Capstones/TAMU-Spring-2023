import React, { useContext } from 'react';
import { useState } from 'react';
import { InputLabel, FormControl, Select, MenuItem, Box, TextField } from '@material-ui/core';
import { useGetOrgsForUser } from '../../../hooks/useGetOrgsForUser';
import { useNavigate } from "react-router-dom";
import { Error } from '../../Pages/Error';
import { Autocomplete, Skeleton } from '@mui/material';
import { Org } from '../../../utils/types';

export const SelectOrg = ({ defaultOption = null }: { defaultOption?: Org | null }) => {
    const [selectValue, setSelectValue] = useState<Org | null>(defaultOption);
    let { loading, orgs, error } = useGetOrgsForUser();
    const navigate = useNavigate();

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
                        navigate(`../${newValue?.name}`, { replace: true, state: { org_name: newValue.name, org_url: newValue.url, org_avatarUrl: newValue.avatarUrl } });
                    }
                }}
                value={selectValue}
                loading={loading}
                sx={{ minWidth: 60, maxWidth: 300 }}
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
                    <TextField {...params} label="Organization" />

                </>}
            />
        </>
    );
};
