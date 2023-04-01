import React, { useContext } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { DataView } from '../../DataView';
import { SelectOrg } from '../../Utility';
import { ErrorPage } from '@backstage/core-components';
import ReactLoading from "react-loading";
import { DataContext } from '../../Root/Root';
import { useGetAllVulns } from '../../../hooks/useGetAllVulns';

const emptyContent = () => {
    return (
        <h1>No teams in this organization listed.</h1>
    )
}

const useCachedAllVulns = (orgName: string|undefined) => {
    const { data, setData } = useContext(DataContext);
    const { loading, orgData, error } = data ? 
        {
            loading: false,
            orgData: data,
            error: undefined
        }
    : useGetAllVulns(orgName);
    
    if (!loading && !error) {
        setData(orgData!);
    }
    
    return {
        data,
        loading,
        error
    };
}

export const Organization = ({} : {}) => {
    const { orgName } = useParams();
    const { data:orgData, loading, error } = useCachedAllVulns(orgName);
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
        navigate(`./${rowData.name}`, { replace: true }); }

    const cols = [
        {title: 'Team Name', field: 'name'}, 
        {title: 'critical', field: 'vulnData.criticalNum'}, 
        {title: 'high', field: 'vulnData.highNum'}, 
        {title: 'moderate', field: 'vulnData.moderateNum'}, 
        {title: 'low', field: 'vulnData.lowNum'}
    ]
    const filters: any[] = []
    const title = 'Teams within this organization'
    return (

        <>
            <SelectOrg defaultOption={orgName ?? ''}/>
            {(orgData?.teams && orgData.teams.length > 0) ?
                <DataView
                    columns={cols}
                    rows={orgData.teams}
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
