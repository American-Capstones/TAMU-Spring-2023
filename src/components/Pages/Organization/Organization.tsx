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

const emptyContent = () => {
    return (
        <h1>No teams in this organization listed.</h1>
    )
}

export const Organization = ({} : {}) => {
    const { orgName } = useParams();
    const { loading, teams } = useGetTeamsForOrg(orgName);
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

    let handleClick = (event: React.MouseEvent | undefined, rowData: any) => {
        navigate(`./${rowData.name}`, { replace: true });
    }

    const cols = [{title: 'Team Name', field: 'name'}]
    const filters: any[] = []
    const title = 'Teams within this organization'
    return (

        <>
            <SelectOrg defaultOption={orgName ?? ''}/>

            <Grid container spacing={2} direction='column'>
                <Grid item>
                    <Graphs barData={mockData} lineData={lineMockData} />
                </Grid>
                <Grid item>
                    <SelectScope handleClick={() => alert('click')} title='Table Scope' />
                    <Table 
                        title={title}
                        options={{ search: true, paging: true }}
                        columns={cols}
                        data={teams}
                        onRowClick={handleClick}
                        filters={filters}
                        emptyContent={emptyContent}
                    />
                </Grid>
            </Grid>
        </>

    );
};
