import React from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import mockData from "../../../mock/data.json";
import lineMockData from '../../../mock/lineMock.json';
import { SelectOrg, SelectScope } from '../../Utility';
import { ErrorPage, Table } from '@backstage/core-components';
import { useGetTeamsForOrg } from '../../../hooks/useGetTeamsForOrg';
import ReactLoading from "react-loading";
import { Graphs } from '../../Graphs';
import { Grid } from '@material-ui/core';
import { Team } from '../../../utils/types';
import { useGetMonthlyVulns } from '../../../hooks/useGetMonthlyVulns';

const emptyTeamsContent = <h1>No teams in this organization available.</h1>
const emptyReposContent = <h1>No Repos in this organization available.</h1>

// todo: This needs to be an API call but that function hasn't been written yet. 
const useGetAllRepos = () => ({ loading: false, repos: [{ name: 'Repo 1' }, { name: 'Repo 2' }]})

export const Organization = ({} : {}) => {
    const { orgName } = useParams();
    // const { loading, months,} = useGetMonthlyVulns(orgName);
    const { loading, teams } = useGetTeamsForOrg(orgName);
    const { loading: repoLoading, repos} = useGetAllRepos();
    const [ showTeams, setShowTeams ] = useState(true);
    const navigate = useNavigate();

    if (loading) {
        return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}> <ReactLoading 
          type={"spin"}
          color={"#8B0000"}
          height={100}
          width={100}
        />
        </div>
    }

    let goToTeams = (event: React.MouseEvent | undefined, rowData: Team) => {
        const severityCount = [
            {
                severity: "Critical",
                count : rowData.critical
            },
            {
                severity: "High",
                count : rowData.high
            },
            {
                severity: "Moderate",
                count : rowData.moderate
            },
            {
                severity: "Low",
                count : rowData.low
            }
        ]
        navigate(`./${rowData.name}`, { state: severityCount, replace: true });
    }

    let changeScope = (newScope: string) => {
        setShowTeams(newScope == 'teams');
    }

    const team_cols = [{title: 'Team Name', field: 'name'}, {title: 'critical', field: 'critical'}, {title: 'high', field: 'high'}, {title: 'moderate', field: 'moderate'}, {title: 'low', field: 'low'}]
    const team_filters: any[] = []
    const team_title = 'Teams within this organization'
    const repo_cols = [{title: 'Repo Name', field: 'name'}]
    const repo_filters: any[] = []
    const repo_title = 'Repos within this organization'
    return (

        <>
            <SelectOrg defaultOption={orgName ?? ''}/>

            <Grid container spacing={2} direction='column'>
                <Grid item>
                    <Graphs barData={mockData} lineData={lineMockData} />
                </Grid>
                <Grid item>
                    <SelectScope handleClick={changeScope} title='Table Scope' defaultOption='teams' />
                    {showTeams ?
                        <Table 
                            title={team_title}
                            options={{ search: true, paging: true }}
                            columns={team_cols}
                            data={teams}
                            onRowClick={goToTeams}
                            filters={team_filters}
                            emptyContent={emptyTeamsContent}
                        />
                    :
                        <Table 
                            title={repo_title}
                            options={{ search: true, paging: true }}
                            columns={repo_cols}
                            data={repos}
                            onRowClick={() => alert('Picked a repo, undefined behavior')}
                            filters={repo_filters}
                            emptyContent={emptyReposContent}
                        />
                    }
                    
                </Grid>
            </Grid>
        </>

    );
};
