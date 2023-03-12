import React from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { DataView } from '../../DataView';
import { InputLabel, FormControl, Select, MenuItem } from '@material-ui/core';

import { useGetTeamsForOrg } from '../../../api/useGetTeamsForOrg';
import { Team } from '../../../utils/types';
import { useGetOrgsForUser } from '../../../api/useGetOrganizationsForUser';
import { Org } from '../../../utils/types';

export const Organization = ({} : {}) => {
    const defaultValues = [];
    const [ orgs, setOrgs ] = useState<Org[]>(defaultValues);

    if (orgs == defaultValues){
        useGetOrgsForUser(10).then((data) => {
            setOrgs(data);
        })
    }
    //console.log("orgList2" , organizationList2);
    const [tableData, setTableData] = useState<Team[]>([]);
    const navigate = useNavigate();

    if (tableData.length == 0) {
        //useGetSeverityCountsForOrg();
        useGetTeamsForOrg("baggage-claim-incorporated", 10).then((data: any) => {
            setTableData(data);
        });
    }

    let handleClick = (event: React.MouseEvent | undefined, rowData: any) => {
        navigate(`./teams/${rowData.name}`, { replace: true });
    }

    const cols = [{title: 'Team Name', field: 'name'}]
    const rows = tableData;
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
            <DataView columns={cols} rows={rows} filters={filters} title={title} onRowClick={handleClick}/>
        </>
    );
};
