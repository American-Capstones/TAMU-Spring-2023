import React, { ReactNode } from 'react';
import { Graphs } from '../../Graphs';
import mockData from "../../../mock/data.json";
import lineMockData from '../../../mock/lineMock_team.json';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useGetReposFromTeam } from '../../../hooks/useGetReposFromTeam';
import ReactLoading from "react-loading";
import { Table } from '@backstage/core-components';
import GroupIcon from '@mui/icons-material/Group';
import { Chip, Grid, Typography } from '@material-ui/core';
import { getColorStyling, makeBarData, makeLineData } from '../../../utils/functions';
import { Alert, Skeleton } from '@mui/material';
import { useGetTeamVulns } from '../../../hooks/useGetTeamVulns';
import { Link } from '@material-ui/icons';

const emptyContent = () => {
    return (
        <h1>This team has no associated repositories</h1>
    )
}

export const TeamPage = ({ }: {}) => {
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
        {
            title: 'Repository Name',
            field: 'name',
            render: (row: any): ReactNode => (
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '.72rem',
                    alignItems: 'center',
                }}><Typography style={{
                    fontWeight: 'bold',
                }} color="textPrimary">{row.name}</Typography> <Link color="primary" fontSize="small" />
                </div>
            )
        },
        { title: 'critical', field: 'critical' },
        { title: 'high', field: 'high' },
        { title: 'moderate', field: 'moderate' },
        { title: 'low', field: 'low' },
        { title: 'topics', field: 'repositoryTopics' }
    ]
    const filters: any[] = [];
    const title = `${teamName}'s Repositories`;

    return (
        <>
            {location.state &&
                <Alert severity='error' style={{ marginBottom: '1rem' }}>{location.state}</Alert>
            }
            {(teamData && !loading) &&
                <div style={{
                    marginBottom: '1.64rem',
                    display: 'flex',
                    flexDirection: 'row',
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '.48rem'
                    }}>
                        <Typography style={{
                            marginTop: 0,
                            marginBottom: 0
                        }} variant='h3'>{(teamData && !loading) ? teamName : ""}</Typography>
                        <Chip
                            label='Team'
                            icon={<GroupIcon sx={{ color: '#333333' }} />}
                            style={{ paddingLeft: '.48rem', marginLeft: '1rem' }} />
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '.48rem'
                    }}>

                        {teamData?.offenses != undefined &&
                            <Chip style={getColorStyling(teamData.offenses.length)} label={`${teamData.offenses.length} Repeat Vulnerabilities`} />
                        }
                    </div>
                </div>
            }
            <Grid container spacing={6} direction='column'>
                <Grid item>
                    <Graphs barData={location.state} lineData={lineMockData} />
                </Grid>
                {/* Used for spacing */}
                <Grid item></Grid>
                <Grid item>
                    {(loading || !teamData) ?
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Skeleton variant="rectangular">
                                <Table title={title}
                                    options={{ search: true, paging: true }}
                                    columns={cols}
                                    data={[]}
                                    onRowClick={goToRepo}
                                    filters={filters}
                                    emptyContent={emptyContent} />
                            </Skeleton>
                        </div>
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
