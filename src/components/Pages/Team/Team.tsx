import React, { useState } from 'react';
import { DataView } from '../../DataView';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetRepositoriesForTeam } from '../../../api/useGetRepositoriesForTeam';
import { Repository } from '../../../utils/types';

const emptyContent = () => {
    return (
        <h1>This team has no associated repositories</h1>
    )
}

export const Team = ({} : {}) => {
    let { teamName } = useParams();
    const [tableData, setTableData] = useState<Repository[]>([])
    const navigate = useNavigate();

    if (tableData.length == 0 && teamName) {
        useGetRepositoriesForTeam('baggage-claim-incorporated', teamName, 10)
        .then((data: any) => {
            setTableData(data);
        })
        .catch((e) => {
            // Need to add more specific error checking here.
            // For now, i'll assume that an error means
            // that the team doesn't exist
            navigate(`../`, { replace: true });
        });
    }

    const goToRepo = (event: React.MouseEvent | undefined, rowData: any) => {
        navigate(`../repos/${rowData.name}`, { replace: true });
    }

    const cols = [{title: 'Repository Name', field: 'name'}]
    const rows = tableData;
    const filters: any[] = [];
    const title = `Repositories under ${teamName}`;
    return (
        <>
            <h1>Team</h1>
            <DataView
                columns={cols}
                rows={rows}
                filters={filters}
                title={title}
                onRowClick={goToRepo}
                emptyContent={emptyContent}/>
            
        </>
    );
};
