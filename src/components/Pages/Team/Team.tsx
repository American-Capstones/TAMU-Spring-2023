import React from 'react';
import { DataView } from '../../DataView';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useGetReposFromTeam } from '../../../hooks/useGetReposFromTeam';
import ReactLoading from "react-loading";
import { Alert } from '@mui/material';

const emptyContent = () => {
    return (
        <h1>This team has no associated repositories</h1>
    )
}

export const Team = () => {
    const { orgName, teamName } = useParams();
    const {loading, repos, error } = useGetReposFromTeam(orgName, teamName);
    const navigate = useNavigate();
    const location = useLocation();

    const goToRepo = (event: React.MouseEvent | undefined, rowData: any) => {
        navigate(`./${rowData.name}`, { replace: true });
    }

    if (error) {
        navigate(`../${orgName}`, { state: error.message, replace: false });
        // return <Error message={error.message}/>
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

    const cols = [{title: 'Repository Name', field: 'name'}]
    const filters: any[] = [];
    const title = `Repositories under ${teamName}`;
    return (
        <>
            { location.state != undefined && 
                <Alert severity='error'>{location.state}</Alert>
            }
            <h1>{teamName}</h1>
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
