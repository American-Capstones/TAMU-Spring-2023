import React, { useContext } from 'react';
import { Graphs } from '../../Graphs';
import { useNavigate, useParams, useLocation} from 'react-router-dom';
import ReactLoading from "react-loading";
import { DataContext } from '../../Root/Root';
import { Team } from '../../../utils/types';
import { Table } from '@backstage/core-components';
import { Grid } from '@material-ui/core';
import { makeBarData, makeLineData } from '../../../utils/functions';
import { Alert } from '@mui/material';

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

export const TopicPage = ({} : {}) => {
    const { orgName, teamName } = useParams();
    const { teamData, loading, error } = useCachedTeamData(teamName);
    const navigate = useNavigate();
    const location = useLocation();

    const goToRepo = (event: React.MouseEvent | undefined, rowData: any) => {
        navigate(`./${rowData.name}`, { replace: true });
    }

    if (error) {
        navigate(`../${orgName}`, { state: { error: error }, replace: false });
        // return <Error message={error.message}/>
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

    const cols = [{title: 'Repository Name', field: 'name'}, {title: 'critical', field: 'critical'}, {title: 'high', field: 'high'}, {title: 'moderate', field: 'moderate'}, {title: 'low', field: 'low'}, {title: 'topics', field: 'repositoryTopics'}]
    const filters: any[] = [];
    const title = `${teamName}'s Repositories`;
    return (
        <>
            { location.state != undefined && location.state.error != undefined &&
                <Alert severity='error'>{location.state.error}</Alert>
            }
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
