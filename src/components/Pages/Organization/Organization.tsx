import { useNavigate, useParams } from "react-router-dom";
import { DataContext } from '../../Root/Root';
import { useGetAllVulns } from '../../../hooks/useGetAllVulns';
import mockData from "../../../mock/data.json";
import lineMockData from '../../../mock/lineMock.json';
import { SelectOrg, SelectScope } from '../../Utility';
import { ErrorPage, Table } from '@backstage/core-components';
import ReactLoading from "react-loading";
import { Graphs } from '../../Graphs';
import { Grid } from '@material-ui/core';
import { getReposForOrg, makeBarData, makeLineData } from '../../../utils/functions';
import { emptyOrg } from '../../../utils/constants';
import { CollectionsBookmarkRounded } from '@material-ui/icons';
import React, { useContext, useState } from "react";

const emptyTeamsContent = <h1>No teams in this organization available.</h1>
const emptyReposContent = <h1>No Repos in this organization available.</h1>


export const Organization = ({} : {}) => {
    const { orgName } = useParams();
    const { loading, data: orgData, error } = useGetAllVulns(orgName)
    const repos = getReposForOrg(orgData);
    const [ showTeams, setShowTeams ] = useState(true);
    const navigate = useNavigate();

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
        navigate(`./${rowData.name}`, { replace: true });
    }

    let changeScope = (newScope: string) => {
        setShowTeams(newScope == 'teams');
    }

    const cols = [
        {title: 'Team Name', field: 'name'}, 
        {title: 'critical', field: 'vulnData.criticalNum'}, 
        {title: 'high', field: 'vulnData.highNum'}, 
        {title: 'moderate', field: 'vulnData.moderateNum'}, 
        {title: 'low', field: 'vulnData.lowNum'}
    ]
    const filters: any[] = []
    
    const team_title = 'Teams within this organization';
    const repo_title = 'Repos within this organization';
    
    return (

        <>
            <SelectOrg defaultOption={orgName ?? ''}/>
            <Grid container spacing={2} direction='column'>
                <Grid item>
                    <Graphs barData={makeBarData(orgData)} lineData={makeLineData(orgData)} />
                </Grid>
                <Grid item>
                    <SelectScope handleClick={() => changeScope} title='Table Scope' defaultOption='teams' />
                    {showTeams ?
                        <Table 
                            title={team_title}
                            options={{ search: true, paging: true }}
                            columns={cols}
                            data={orgData.teams}
                            onRowClick={goToTeams}
                            filters={filters}
                            emptyContent={emptyTeamsContent}
                        />
                    :
                        <Table 
                            title={repo_title}
                            options={{ search: true, paging: true }}
                            columns={cols}
                            data={repos}
                            onRowClick={() => alert('Picked a repo, undefined behavior')}
                            filters={filters}
                            emptyContent={emptyReposContent}
                        />
                    }
                    
                </Grid>
            </Grid>
        </>

    );
};
