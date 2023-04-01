import React, { useContext } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { DataView } from '../../DataView';
import { SelectOrg } from '../../Utility';
import { ErrorPage } from '@backstage/core-components';
import { useGetTeamsForOrg } from '../../../hooks/useGetTeamsForOrg';
import ReactLoading from "react-loading";
import { DataContext } from '../../Root/Root';

const emptyContent = () => {
    return (
        <h1>No teams in this organization listed.</h1>
    )
}

export const Organization = ({} : {}) => {
    const { orgName } = useParams();
    const { loading, teams } = useGetTeamsForOrg(orgName);
    const { data, setData } = useContext(DataContext);
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
        setData(rowData.name);
        navigate(`./${rowData.name}`, { replace: true });
    }

    const cols = [{title: 'Team Name', field: 'name'}, {title: 'critical', field: 'critical'}, {title: 'high', field: 'high'}, {title: 'moderate', field: 'moderate'}, {title: 'low', field: 'low'}]
    const filters: any[] = []
    const title = 'Teams within this organization'
    return (

        <>
            <h1>{data}</h1>
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
