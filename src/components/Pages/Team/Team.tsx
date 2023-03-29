import React from 'react';
import { Graphs } from '../../Graphs';
import mockData from "../../../mock/data.json";
import lineMockData from '../../../mock/lineMock_team.json';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useGetReposFromTeam } from '../../../hooks/useGetReposFromTeam';
import ReactLoading from "react-loading";
import { Table } from '@backstage/core-components';
import { SelectScope } from '../../Utility';
import { Grid } from '@material-ui/core';

const emptyContent = () => {
    return (
        <h1>This team has no associated repositories</h1>
    )
}

export const Team = ({} : {}) => {
    const { orgName, teamName } = useParams();
    const {loading, repos, error } = useGetReposFromTeam(orgName, teamName);
    const navigate = useNavigate();
    const location = useLocation();

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
    const title = `${teamName}'s Repositories`;
    return (
        <>
            <h1>{teamName}</h1>
            <Grid container spacing={6} direction='column'>
                <Grid item>
                    <Graphs barData={location.state} lineData={lineMockData} />
                </Grid>
                {/* Used for spacing */}
                <Grid item></Grid> 
                <Grid item>
                    <Table 
                        title={title}
                        options={{ search: true, paging: true }}
                        columns={cols}
                        data={repos}
                        onRowClick={goToRepo}
                        filters={filters}
                        emptyContent={emptyContent}
                    />  
                </Grid>
            </Grid>
        </>
    );
};
