import React, { useContext } from 'react';
import { DataView } from '../../DataView';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetReposFromTeam } from '../../../hooks/useGetReposFromTeam';
import ReactLoading from "react-loading";
import { DataContext } from '../../Root/Root';

const emptyContent = () => {
    return (
        <h1>This team has no associated repositories</h1>
    )
}

export const Team = ({} : {}) => {
    const { orgName, teamName } = useParams();
    const {loading, repos, error } = useGetReposFromTeam(orgName, teamName);
    const { data, setData } = useContext(DataContext);
    const navigate = useNavigate();

    const goToRepo = (event: React.MouseEvent | undefined, rowData: any) => {
        navigate(`./${rowData.name}`, { replace: true });
    }

    if (loading) {
        return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}> <ReactLoading 
          type={"spin"}
          color={"#8B0000"}
          height={100}
          width={100}
        />
        </div>
    }

    const cols = [{title: 'Repository Name', field: 'name'}, {title: 'critical', field: 'critical'}, {title: 'high', field: 'high'}, {title: 'moderate', field: 'moderate'}, {title: 'low', field: 'low'}]
    const filters: any[] = [];
    const title = `Repositories under ${teamName}`;
    return (
        <>
            <h1>Team - {data}</h1>
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
