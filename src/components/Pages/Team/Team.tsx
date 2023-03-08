import React, { useState } from 'react';
import { DataView } from '../../DataView';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetRepositoriesForTeam } from '../../../api/useGetRepositoriesForTeam';
import { Repository } from '../../../utils/types';

export const Team = ({} : {}) => {
    const { teamName } = useParams();
    const [tableData, setTableData] = useState<Repository[]>([])
    const navigate = useNavigate();

    if (tableData.length == 0) {
        useGetRepositoriesForTeam().then((data: any) => {
            setTableData(data);
        });
    }

    // todo: This is where we should do some checking to make sure that the team actually exists within the github organization.
    // todo: if it does not exist, we can just set teamName to undefined and it will generate the correct error message.

    // of less importance, but it might be beneficial to design a standardized error styling system across our plugin.

    const goToRepo = (event: React.MouseEvent | undefined, rowData: any) => {
        navigate(`../repos/${rowData.name}`, { replace: true });
    }

    const cols = [{title: 'Repository Name', field: 'name'}]
    const rows = tableData;
    const filters: any[] = [];
    const title = `Repositories under Team ${teamName}`;
    return (
        <>
            <h1>Team</h1>
            {teamName != ':teamName' && teamName != undefined ?
                <DataView columns={cols} rows={rows} filters={filters} title={`Repositories for team ${teamName}`} onRowClick={goToRepo}/>
                :
                <h1>Error - this team does not exist.</h1>
            }
        </>
    );
};
