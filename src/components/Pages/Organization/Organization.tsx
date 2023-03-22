import React from 'react';
import { useNavigate } from "react-router-dom";
import { DataView } from '../../DataView';
import { InputLabel, FormControl, Select, MenuItem } from '@material-ui/core';

import { ErrorPage } from '@backstage/core-components';
import { useGetOrgsForUser } from '../../../hooks/useGetOrgsForUser';
import { useGetTeamsForOrg } from '../../../hooks/useGetTeamsForOrg';

const emptyContent = () => {
    return (
        <h1>No teams in this organization listed.</h1>
    )
}

export const Organization = ({} : {}) => {
    let { loading: isLoading_Orgs, orgs } = useGetOrgsForUser();
    let { loading: isLoading_Teams, teams} = useGetTeamsForOrg("baggage-claim-incorporated") 
    // TODO: PASS SELECTED TO useGetTeamsForOrg
    const navigate = useNavigate();

    let handleClick = (event: React.MouseEvent | undefined, rowData: any) => {
        navigate(`./teams/${rowData.name}`, { replace: true });
    }

    const cols = [{title: 'Team Name', field: 'name'}]
    const filters: any[] = []
    const title = 'Teams within this organization'
    return (
        <>
            <FormControl style={{width: 200, paddingBottom: 30 }}>
                <InputLabel>Organization Name</InputLabel>
                <Select
                    label="Organization Name"
                >
                    {orgs?.map(org => {
                        return (
                            <MenuItem value={org}>{org}</MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
            {(!isLoading_Teams && teams.length > 0) ?
                <DataView
                    columns={cols}
                    rows={teams}
                    filters={filters}
                    title={title}
                    onRowClick={handleClick}
                    emptyContent={emptyContent}/>
            :
                <ErrorPage status={'Empty data obj'} statusMessage={'No row data'} />
            }
        </>
    );
};
