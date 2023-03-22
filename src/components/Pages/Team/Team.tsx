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
    let { orgName, teamName } = useParams();
    let {loading: isLoading, repos } = useGetReposFromTeam(orgName, teamName);

    const navigate = useNavigate();

    const goToRepo = (event: React.MouseEvent | undefined, rowData: any) => {
        navigate(`./${rowData.name}`, { replace: true });
    }

    const cols = [{title: 'Repository Name', field: 'name'}]
    const filters: any[] = [];
    const title = `Repositories under ${teamName}`;
    return (
        <>
            <h1>Team</h1>
            <DataView
                columns={cols}
                rows={repos}
                filters={filters}
                title={title}
                onRowClick={goToRepo}
                emptyContent={emptyContent}/>
        </>
    );
};
