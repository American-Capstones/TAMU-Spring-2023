import React from 'react';
import { Graphs } from '../../Graphs';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Table } from '@backstage/core-components';
import { Grid } from '@material-ui/core';
import { makeBarData, makeLineData } from '../../../utils/functions';
import { useGetTopicVulns } from '../../../hooks/useGetTopicVulns';
import { Alert, Skeleton } from '@mui/material';

const emptyContent = <h1>This team has no associated repositories</h1>;

export const TopicPage = ({ }: {}) => {
    const { orgName, topicName } = useParams();
    const { data: topicData, loading, error } = useGetTopicVulns(orgName, topicName);
    const navigate = useNavigate();
    const location = useLocation();

    const goToRepo = (event: React.MouseEvent | undefined, rowData: any) => {
        navigate(`./${rowData.name}`, { replace: true });
    }

    if (error) {
        navigate(`../${orgName}`, { state: { error: error }, replace: false });
    }

    const cols = [
        { title: 'Repository Name', field: 'name' },
        { title: 'critical', field: 'critical' },
        { title: 'high', field: 'high' },
        { title: 'moderate', field: 'moderate' },
        { title: 'low', field: 'low' },
        { title: 'topics', field: 'repositoryTopics' }
    ]
    const filters: any[] = [];
    const title = `Repositories associated with ${topicName}`;
    return (
        <>
            {location.state &&
                <Alert severity='error' style={{ marginBottom: '1rem' }}>{location.state}</Alert>
            }
            <Grid container spacing={6} direction='column'>
                <Grid item>
                    <Graphs barData={makeBarData(topicData)} lineData={makeLineData(topicData)} />
                </Grid>
                {/* Used for spacing */}
                <Grid item></Grid>
                <Grid item>
                    {(loading || !topicData) ?
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
                            subtitle={topicName}
                            options={{ search: true, paging: true }}
                            columns={cols}
                            data={topicData!.repos}
                            onRowClick={goToRepo}
                            filters={filters}
                            emptyContent={emptyContent}
                        />}
                </Grid>
            </Grid>

        </>
    );
};
