import React, { useContext } from 'react';
import { Graphs } from '../../Graphs';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ReactLoading from "react-loading";
import { DataContext } from '../../Root/Root';
import { Team } from '../../../utils/types';
import { Table } from '@backstage/core-components';
import { Grid } from '@material-ui/core';
import { makeBarData, makeLineData } from '../../../utils/functions';
import { Alert, Skeleton } from '@mui/material';
import { useGetTeamVulns } from '../../../hooks/useGetTeamVulns';

const emptyContent = () => {
    return (
        <h1>This team has no associated repositories</h1>
    )
}

export const TeamPage = ({} : {}) => {
    const { orgName, teamName } = useParams();
    const { data: teamData, loading, error } = useGetTeamVulns(orgName, teamName);
    const navigate = useNavigate();
    const location = useLocation();

    const goToRepo = (event: React.MouseEvent | undefined, rowData: any) => {
        navigate(`./${rowData.name}`, { replace: true });
    }

    if (error) {
        navigate(`../${orgName}`, { state: { error: error }, replace: false });
    }

    const cols = [
        {title: 'Repository Name', field: 'name'},
        {title: 'critical', field: 'critical'},
        {title: 'high', field: 'high'},
        {title: 'moderate', field: 'moderate'},
        {title: 'low', field: 'low'},
        {title: 'topics', field: 'repositoryTopics'}
    ]
    const filters: any[] = [];
    const title = `${teamName}'s Repositories`;
    
    return (
        <>
            {location.state && 
                <Alert severity='error' style={{marginBottom: '1rem'}}>{location.state}</Alert>
            }
            <h1>{teamName}</h1>
            <Grid container spacing={6} direction='column'>
                <Grid item>
                {!loading && teamData &&
                    <Graphs barData={makeBarData(teamData)} lineData={makeLineData(teamData)} isLoading={loading} />
                }
                </Grid>
                {/* Used for spacing */}
                <Grid item></Grid>
                <Grid item>
                    {(loading || !teamData) ?
                        <Skeleton variant="rectangular">
                            <Table title={title}
                                options={{ search: true, paging: true }}
                                columns={cols}
                                data={teamData!.repos}
                                onRowClick={goToRepo}
                                filters={filters}
                                emptyContent={emptyContent} />
                        </Skeleton>
                    :
                    <Table
                        title="Repositories"
                        subtitle={teamName}
                        options={{ search: true, paging: true }}
                        columns={cols}
                        data={teamData!.repos}
                        onRowClick={goToRepo}
                        filters={filters}
                        emptyContent={emptyContent}
                    />}
                </Grid>
            </Grid>

        </>
    );
};
