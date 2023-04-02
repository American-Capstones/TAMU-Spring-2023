import React from 'react';
import { useState } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { DataView } from '../../DataView';
import { SelectOrg } from '../../Utility';
import { useGetTeamsForOrg } from '../../../hooks/useGetTeamsForOrg';

// import { ErrorPage } from '@backstage/core-components';
import { Error } from '../Error';
import ReactLoading from "react-loading";
import { Alert, Breadcrumbs } from '@mui/material';
import { Org } from '../../../utils/types';
import { Header } from '@backstage/core-components';

const emptyContent = () => {
    return (
        <h1>No teams in this organization listed.</h1>
    )
}

export interface stateInterface {
    org_name: string,
    org_avatarUrl: string,
    org_url: string
}

export const Organization = () => {
    const { orgName } = useParams();
    const { loading, teams, error } = useGetTeamsForOrg(orgName);
    const navigate = useNavigate();

    if (loading) {
        return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}> <ReactLoading
            type={"spin"}
            color={"#8B0000"}
            height={100}
            width={100}
        />
        </div>
    }
    const location = useLocation();

    let handleClick = (event: React.MouseEvent | undefined, rowData: any) => {
        navigate(`./${rowData.name}`, { replace: true });
    }

    if (error) {
        navigate(`../`, { state: { error: error.message }, replace: false });
    }


    const cols = [{ title: 'Team Name', field: 'name' }]
    const filters: any[] = []
    const title = 'Teams within ' + orgName;

    return (

        <>
            {location.state != undefined && location.state.error != undefined &&
                <Alert severity='error'>{location.state.error}</Alert>
            }
            <SelectOrg defaultOption={orgName} />

            <div style={{
                marginTop: '2.48rem'
            }}>
                {(teams && teams.length > 0) ?
                    <DataView
                        columns={cols}
                        rows={teams}
                        filters={filters}
                        title={title}
                        onRowClick={handleClick}
                        emptyContent={emptyContent} />
                    :
                    // <ErrorPage status={'Empty data obj'} statusMessage={'No row data'} />
                    <Error message="" />
                }
            </div>
        </>

    );
};
