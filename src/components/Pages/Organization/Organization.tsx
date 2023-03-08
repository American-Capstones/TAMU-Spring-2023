import React from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { DataView } from '../../DataView';
import { useGetTeamsForOrg } from '../../../api/useGetTeamsForOrg';
import { Team } from '../../../utils/types';

export const Organization = ({} : {}) => {
    const [tableData, setTableData] = useState<Team[]>([]);
    const navigate = useNavigate();

    if (tableData.length == 0) {
        useGetTeamsForOrg().then((data: any) => {
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
            <h1>Organization</h1>
            <DataView columns={cols} rows={rows} filters={filters} title={title} onRowClick={handleClick}/>
        </>
    );
};
