import React from 'react';
import { useState } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { DataView } from '../../DataView';
import { SelectOrg } from '../../Utility';
import { useGetTeamsForOrg } from '../../../hooks/useGetTeamsForOrg';

// import { ErrorPage } from '@backstage/core-components';
import { Error } from '../Error';
import ReactLoading from "react-loading";
import { Alert } from '@mui/material';
import { Org } from '../../../utils/types';

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

    let handleClick = (event: React.MouseEvent | undefined, rowData: any) => {
        navigate(`./${rowData.name}`, { replace: true });
    }

    if (error) {
        navigate(`../`, { state: error.message, replace: false });
    }


    const cols = [{ title: 'Team Name', field: 'name' }]
    const filters: any[] = []
    const title = 'Teams within ' + orgName;
    const location = useLocation();
    const { org_name, org_avatarUrl, org_url } = location.state as stateInterface;
    console.log(org_name);
    return (

        <>
            {location.state != undefined &&
                <Alert severity='error'>{location.state}</Alert>
            }
            <SelectOrg defaultOption={{
                name: org_name,
                avatarUrl: org_avatarUrl,
                url: org_url
            }} />
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
        </>

    );
};
