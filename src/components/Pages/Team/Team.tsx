import React from 'react';
import { DataView } from '../../DataView';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetReposFromTeam } from '../../../hooks/useGetReposFromTeam';

const emptyContent = () => {
    return (
        <h1>This team has no associated repositories</h1>
    )
}

export const Team = ({} : {}) => {
    let { teamName } = useParams();
    let {loading: isLoading, repos } = useGetReposFromTeam('baggage-claim-incorporated', teamName);
    // TODO: PASS SELECTED TO useGetReposFromTeam

    const navigate = useNavigate();

    const goToRepo = (event: React.MouseEvent | undefined, rowData: any) => {
        navigate(`../repos/${rowData.name}`, { replace: true });
    }

    const cols = [{title: 'Repository Name', field: 'name'}]
    const filters: any[] = [];
    const title = `Repositories under ${teamName}`;
    return (
        <>
            <h1>Team</h1>
            {teamName != ':teamName' && teamName != undefined && !isLoading ?
                <DataView
                    columns={cols}
                    rows={repos}
                    filters={filters}
                    title={title}
                    onRowClick={goToRepo}
                    emptyContent={emptyContent}/>
                :
                <h1>Error - this team does not exist.</h1>
            }
        </>
    );
};
