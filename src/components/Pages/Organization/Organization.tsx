import React from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { DataView } from '../../DataView';
import { InputLabel, FormControl, Select, MenuItem } from '@material-ui/core';

import { useGetTeamsForOrg } from '../../../api/useGetTeamsForOrg';
import { Team } from '../../../utils/types';
import { useGetOrgsForUser } from '../../../api/useGetOrganizationsForUser';
import { formatOrgData } from '../../../utils/functions';
import { ErrorPage } from '@backstage/core-components';
import ReactLoading from "react-loading";

const emptyContent = () => {
    return (
        <h1>No teams in this organization listed.</h1>
    )
}

export const Organization = ({} : {}) => {
    const defaultValues: string[] = [];
    const [ orgs, setOrgs ] = useState<string[]>(defaultValues);
    const [ done, setDone ] = useState(false);

    if (orgs == defaultValues){
        useGetOrgsForUser(10).then((data) => {
            setOrgs(formatOrgData(data));
        })
    }
    //console.log("orgList2" , organizationList2);
    const [tableData, setTableData] = useState<Team[]>([]);
    const navigate = useNavigate();

    if (tableData.length == 0) {
        useGetTeamsForOrg("baggage-claim-incorporated", 10)
        .then((data: any) => {
            setTableData(data)
            setDone(true);
        });
    }

    if (!done) {
        return <div style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}> <ReactLoading 
          type={"spin"}
          color={"#8B0000"}
          height={100}
          width={100}
        />
        </div>
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
            {(tableData && tableData.length > 0) ?
                <DataView
                    columns={cols}
                    rows={rows}
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
