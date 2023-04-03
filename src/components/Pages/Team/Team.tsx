import React, { useContext } from 'react';
import { Graphs } from '../../Graphs';
import mockData from "../../../mock/data.json";
import lineMockData from '../../../mock/lineMock_team.json';
import { useNavigate, useParams } from 'react-router-dom';
import ReactLoading from "react-loading";
import { DataContext } from '../../Root/Root';
import { Team } from '../../../utils/types';
import { Table } from '@backstage/core-components';
import { Grid } from '@material-ui/core';
import { makeBarData } from '../../../utils/functions';
import { makeLineData } from '../../../utils/functions';

const emptyContent = () => {
    return (
        <h1>This team has no associated repositories</h1>
    )
}

const useCachedTeamData = (teamName:string|undefined) => {
    const { data, setData } = useContext(DataContext);
    let loading = false;
    let teamData:Team|undefined = undefined;
    let error: string|undefined = undefined;

    for( let team of data.teams ) {
        if (team.name == teamName) {
            teamData = team;
            break;
        }
    }

    if (!teamData) {
        error = "Error: Team not found";
    }
    
    return {
        teamData,
        loading,
        error
    };
}

export const TeamPage = ({} : {}) => {
    const { orgName, teamName } = useParams();
    const { teamData, loading, error } = useCachedTeamData(teamName);

    // const { data, setData } = useContext(DataContext);
    const navigate = useNavigate();

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
                    <Graphs barData={makeBarData(teamData)} lineData={makeLineData(teamData)} />
                </Grid>
                {/* Used for spacing */}
                <Grid item></Grid> 
                <Grid item>
                    <Table 
                        title={title}
                        options={{ search: true, paging: true }}
                        columns={cols}
                        data={teamData!.repos}
                        onRowClick={goToRepo}
                        filters={filters}
                        emptyContent={emptyContent}
                    />  
                </Grid>
            </Grid>
        </>
    );
};
