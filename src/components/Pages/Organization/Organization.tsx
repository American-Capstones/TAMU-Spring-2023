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
import { Alert } from '@mui/material';

const emptyTeamsContent = <h1>No teams in this organization available.</h1>
const emptyReposContent = <h1>No Repos in this organization available.</h1>
const emptyTopicsContent = <h1>No Topics in this organization available.</h1>


export interface stateInterface {
    org_name: string,
    org_avatarUrl: string,
    org_url: string
}

const team_cols = [
    {title: 'Team Name', field: 'name'}, 
    {title: 'critical', field: 'vulnData.criticalNum'}, 
    {title: 'high', field: 'vulnData.highNum'}, 
    {title: 'moderate', field: 'vulnData.moderateNum'}, 
    {title: 'low', field: 'vulnData.lowNum'}
]
const topic_cols = [
    {title: 'Topic Name', field: 'name'}, 
    {title: 'critical', field: 'vulnData.criticalNum'}, 
    {title: 'high', field: 'vulnData.highNum'}, 
    {title: 'moderate', field: 'vulnData.moderateNum'}, 
    {title: 'low', field: 'vulnData.lowNum'}
]
const repo_cols = [
    {title: 'Repo Name', field: 'name'}, 
    {title: 'critical', field: 'critical'}, 
    {title: 'high', field: 'high'}, 
    {title: 'moderate', field: 'moderate'}, 
    {title: 'low', field: 'low'},
    {title: 'topics', field: 'repositoryTopics'}
]

export const Organization = () => {
    const { orgName } = useParams();
    const { loading, data: orgData, error } = useGetAllVulns(orgName)
    const [ tableScope, setTableScope ] = useState("teams");
    const navigate = useNavigate();
    const location = useLocation();

    if (loading || orgData.name == "") {
        return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}> <ReactLoading 
          type={"spin"}
          color={"#8B0000"}
          height={100}
          width={100}
        />
        </div>
    }
    
    let goToTeams = (event: React.MouseEvent | undefined, rowData: any) => {
        navigate(`./team/${rowData.name}`, { replace: true });
    }

    let goToTopics = (event: React.MouseEvent | undefined, rowData: any) => {
        navigate(`./topic/${rowData.name}`, { replace: true });
    }

    let changeScope = (newScope: string) => {
        setTableScope(newScope);
    }

    if (error) {
        navigate(`../`, { state: { error: error.message }, replace: false });
    }

    const filters: any[] = []    
    const team_title = 'Teams within this organization';
    const repo_title = 'Repos within this organization';
    const topic_title = 'Topics within this organization';
    
    return (
        <>
            {location.state && location.state.error &&
                <Alert severity='error'>{location.state.error}</Alert>
            }
            <SelectOrg defaultOption={orgName ?? ''}/>
            <Grid container spacing={2} direction='column'>
                <Grid item>
                    <Graphs barData={makeBarData(orgData)} lineData={makeLineData(orgData)} />
                </Grid>
                <Grid item>
                    <SelectScope handleClick={changeScope} title='Table Scope' defaultOption='teams' />
                    {tableScope == "teams" &&
                        <Table 
                            title={team_title}
                            options={{ search: true, paging: true }}
                            columns={team_cols}
                            data={orgData.teams}
                            onRowClick={goToTeams}
                            filters={filters}
                            emptyContent={emptyTeamsContent}
                        />
                    }
                    {tableScope == "repositories" &&
                        <Table 
                            title={repo_title}
                            options={{ search: true, paging: true }}
                            columns={repo_cols}
                            data={orgData.repos}
                            onRowClick={() => alert('Picked a repo, undefined behavior')}
                            filters={filters}
                            emptyContent={emptyReposContent}
                        />
                    }
                    {tableScope == "topics" &&
                        <Table
                            title={topic_title}
                            options={{ search: true, paging: true }}
                            columns={topic_cols}
                            data={orgData.topics}
                            onRowClick={goToTopics}
                            filters={filters}
                            emptyContent={emptyTopicsContent}
                        />
                    }
                </Grid>
            </Grid>
        </>
    )
};
