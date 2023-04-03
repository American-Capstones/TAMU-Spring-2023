import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useGetAllVulns } from '../../../hooks/useGetAllVulns';
import { SelectOrg, SelectScope } from '../../Utility';
import { Table } from '@backstage/core-components';
import ReactLoading from "react-loading";
import { Graphs } from '../../Graphs';
import { Grid } from '@material-ui/core';
import { makeBarData, makeLineData } from '../../../utils/functions';
import { Error } from '../Error';
import { Alert, Skeleton } from '@mui/material';

const emptyTeamsContent = <h1>No teams in this organization available.</h1>
const emptyReposContent = <h1>No Repos in this organization available.</h1>


export interface stateInterface {
    org_name: string,
    org_avatarUrl: string,
    org_url: string
}

export const Organization = () => {
    const { orgName } = useParams();
    const { loading, data: orgData, error } = useGetAllVulns(orgName)
    // const repos = getReposForOrg(orgData);
    const [tableScope, setTableScope] = useState("teams");
    const navigate = useNavigate();
    const location = useLocation();

    console.log('orgData', orgData)
    console.log('loading', loading)

    // if (loading || orgData.name == "") {
    //     return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}> <ReactLoading
    //       type={"spin"}
    //       color={"#8B0000"}
    //       height={100}
    //       width={100}
    //     />
    //     </div>
    // }

    let goToTeams = (event: React.MouseEvent | undefined, rowData: any) => {
        navigate(`./${rowData.name}`, { replace: true });
    }

    let changeScope = (newScope: string) => {
        console.log('here', newScope)
        setTableScope(newScope);
    }

    if (error) {
        navigate(`../`, { state: { error: error.message }, replace: false });
    }

    const cols = [
        { title: 'Team', field: 'name' },
        { title: 'critical', field: 'vulnData.criticalNum' },
        { title: 'high', field: 'vulnData.highNum' },
        { title: 'moderate', field: 'vulnData.moderateNum' },
        { title: 'low', field: 'vulnData.lowNum' }
    ]
    const repo_cols = [
        { title: 'Repository', field: 'name' },
        { title: 'critical', field: 'critical' },
        { title: 'high', field: 'high' },
        { title: 'moderate', field: 'moderate' },
        { title: 'low', field: 'low' }
    ]

    const topic_cols = [
        { title: 'GitHub Topic', field: 'name' },
        { title: 'critical', field: 'critical' },
        { title: 'high', field: 'high' },
        { title: 'moderate', field: 'moderate' },
        { title: 'low', field: 'low' }
    ]
    const filters: any[] = []

    const team_title = 'Teams within this organization';
    const repo_title = 'Repos within this organization';
    const topic_title = 'Topics within this organization';

    return (
        <>
            {location.state && location.state.error &&
                <Alert severity='error'>{location.state.error}</Alert>
            }
            <div style={{marginBottom:'1.24rem'}}>
                <SelectOrg defaultOption={orgName ?? ''} />
            </div>
            <Grid container spacing={8} direction='column'>
                <Grid item>
                    <Graphs barData={makeBarData(orgData)} lineData={makeLineData(orgData)} isLoading={loading} />
                </Grid>
                <Grid item>
                    <div style={{marginBottom:'1.04rem'}}>
                        <SelectScope handleClick={changeScope} title='Table Scope' defaultOption='teams' />
                    </div>
                    {loading && <Skeleton variant="rectangular" width="100%">                        <Table
                        columns={cols}
                        data={orgData.teams}
                        onRowClick={goToTeams}
                        filters={filters}
                        emptyContent={emptyTeamsContent}
                        isLoading={loading}
                    /></Skeleton>}
                    {tableScope == "teams" && !loading &&
                        <Table
                            title="Subteams"
                            subtitle={orgName}
                            options={{ search: true, paging: true }}
                            columns={cols}
                            data={orgData.teams}
                            onRowClick={goToTeams}
                            filters={filters}
                            emptyContent={emptyTeamsContent}
                            isLoading={loading}
                        />
                    }
                    {tableScope == "repositories" && !loading &&
                        <Table
                            title="Repositories"
                            subtitle={orgName}
                            options={{ search: true, paging: true }}
                            columns={repo_cols}
                            data={orgData.repos}
                            onRowClick={() => alert('Picked a repo, undefined behavior')}
                            filters={filters}
                            emptyContent={emptyReposContent}
                            isLoading={loading}
                        />
                    }
                    {tableScope == "topics" && !loading &&
                        <Table
                            title="Topics"
                            subtitle={orgName}
                            options={{ search: true, paging: true }}
                            columns={topic_cols}
                            data={orgData.topics}
                            onRowClick={() => alert('Picked a topic, undefined behavior')}
                            filters={filters}
                            emptyContent={<h1>No topics in this organization available.</h1>}
                            isLoading={loading}
                        />
                    }

                </Grid>
            </Grid>
        </>
    )
};
