import React from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { DataView } from '../../DataView';
import { SelectOrg } from '../../Utility';
import { ErrorPage } from '@backstage/core-components';
import { useGetTeamsForOrg } from '../../../hooks/useGetTeamsForOrg';

const emptyContent = () => {
    return (
        <h1>No teams in this organization listed.</h1>
    )
}

export const Organization = ({} : {}) => {
    const { orgName } = useParams();
    let { loading: isLoading_Teams, teams} = useGetTeamsForOrg(orgName);
    const navigate = useNavigate();

    let handleClick = (event: React.MouseEvent | undefined, rowData: any) => {
        navigate(`./${rowData.name}`, { replace: true });
    }

    const cols = [{title: 'Team Name', field: 'name'}]
    const filters: any[] = []
    const title = 'Teams within this organization'
    return (
        <>
            <SelectOrg defaultOption={orgName ?? ''}/>
            {(teams && teams.length > 0) ?
                <DataView
                    columns={cols}
                    rows={teams}
                    filters={filters}
                    title={title}
                    onRowClick={handleClick}
                    emptyContent={emptyContent}/>
            :
                <ErrorPage status={'Empty data obj'} statusMessage={'No row data'} />
            }
        </>
    );
};
