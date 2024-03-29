import React, { useContext, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useGetAllVulns } from '../../../hooks/useGetAllVulns';
import { SelectOrg, SelectScope } from '../../Utility';
import { SubvalueCell, Table } from '@backstage/core-components';
import { Graphs } from '../../Graphs';
import { useGetMonthlyVulns } from '../../../hooks/useGetMonthlyVulns';
import { Team } from '../../../utils/types';
import { Button, Grid, Typography } from '@material-ui/core';
import { makeBarData, makeLineData } from '../../../utils/functions';
import { Alert, Skeleton, colors } from '@mui/material';
import { ScopeContext } from "../../Root/Root";
import { Link } from "@material-ui/icons";
import { colorVariants } from "@backstage/theme";

const emptyTeamsContent = <h1>No teams in this organization available.</h1>
const emptyReposContent = <h1>No Repos in this organization available.</h1>
const emptyTopicsContent = <h1>No Topics in this organization available.</h1>


export interface stateInterface {
    org_name: string,
    org_avatarUrl: string,
    org_url: string
}

const team_cols = [
    {
        title: 'Team Name',
        field: 'name',
        render: (row: any): React.ReactNode => (
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
    { title: 'critical', field: 'vulnData.criticalNum' },
    { title: 'high', field: 'vulnData.highNum' },
    { title: 'moderate', field: 'vulnData.moderateNum' },
    { title: 'low', field: 'vulnData.lowNum' }
]
const topic_cols = [
    {
        title: 'Topic Name',
        field: 'name',
        render: (row: any): React.ReactNode => (
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
    { title: 'critical', field: 'vulnData.criticalNum' },
    { title: 'high', field: 'vulnData.highNum' },
    { title: 'moderate', field: 'vulnData.moderateNum' },
    { title: 'low', field: 'vulnData.lowNum' }
]
const repo_cols = [
    {
        title: 'Repo Name',
        field: 'name',
        render: (row: any): React.ReactNode => (
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

export const Organization = () => {
    const { orgName } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, data: orgData, error } = useGetAllVulns(orgName);
    const { scope } = useContext(ScopeContext);
    const [tableScope, setTableScope] = useState<string>(scope);

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

    let goToTopics = (event: React.MouseEvent | undefined, rowData: any) => {
        navigate(`./topic/${rowData.name}`, { replace: true });
    }

    let goToRepo = (event: React.MouseEvent | undefined, rowData: any) => {
        navigate(`./repo/${rowData.name}`, { replace: true });
    }

    let changeScope = (newScope: string) => {
        setTableScope(newScope);
    }

    if (error) {
        navigate(`../`, { state: { error: error.message }, replace: false });
    }

    const filters: any[] = []

    return (
        <>
            {location.state && location.state.error &&
                <Alert severity='error' style={{ marginBottom: '1rem' }}>{location.state.error}</Alert>
            }
            <div style={{ marginBottom: '1.24rem' }}>
                <SelectOrg defaultOption={orgName ?? ''} />
            </div>
            <Grid container spacing={8} direction='column'>
                <Grid item>
                    <Graphs barData={makeBarData(orgData)} lineData={makeLineData(orgData)} isLoading={loading} />
                </Grid>
                <Grid item>
                    <div style={{ marginBottom: '1.04rem' }}>
                        <SelectScope handleClick={changeScope} defaultOption={scope} />
                    </div>
                    {(loading || !orgData) &&
                        <Skeleton variant="rectangular" width="100%">
                            <Table
                                columns={team_cols}
                                data={[]}
                                onRowClick={goToTeams}
                                filters={filters}
                                emptyContent={emptyTeamsContent}
                                isLoading={loading}
                            /></Skeleton>
                    }
                    {tableScope == "teams" && !loading &&
                        <Table
                            title="Subteams"
                            subtitle={orgName}
                            options={{ search: true, paging: true }}
                            columns={team_cols}
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
                            onRowClick={goToRepo}
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
                            onRowClick={goToTopics}
                            filters={filters}
                            emptyContent={emptyTopicsContent}
                            isLoading={loading}
                        />
                    }

                </Grid>
            </Grid>
        </>
    )
};
