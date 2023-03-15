import React from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { DataView } from '../../DataView';
import { useGetTeamsForOrg } from '../../../api/useGetTeamsForOrg';
import { Team } from '../../../utils/types';
import { useGetOrgsForUser } from '../../../api/useGetOrganizationsForUser';
import { formatOrgData } from '../../../utils/functions';
import { ErrorPage } from '@backstage/core-components';
import { SelectOrg } from '../../Utility';

const emptyContent = () => {
    return (
        <h1>No teams in this organization listed.</h1>
    )
}

export const Organization = ({} : {}) => {
    const defaultValues: string[] = [];
    const [ orgs, setOrgs ] = useState<string[]>(defaultValues);
    const [tableData, setTableData] = useState<Team[]>([]);
    const navigate = useNavigate();
    const { orgName } = useParams();

    if (orgs == defaultValues){
        useGetOrgsForUser(10).then((data) => {
            setOrgs(formatOrgData(data));
        })
    }

    if (tableData.length == 0) {
        useGetTeamsForOrg("baggage-claim-incorporated", 10)
        .then((data: any) => {
            setTableData(data);
        });
    }

    let handleClick = (event: React.MouseEvent | undefined, rowData: any) => {
        navigate(`./${rowData.name}`, { replace: true });
    }

    const cols = [{title: 'Team Name', field: 'name'}]
    const rows = tableData;
    const filters: any[] = []
    const title = 'Teams within this organization'
    return (
        <>
            <SelectOrg defaultOption={orgName ?? ''}/>
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
