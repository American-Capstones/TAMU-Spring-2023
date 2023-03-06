import React from 'react';
import { useNavigate } from "react-router-dom";
import { DataView, TableProps } from '../../DataView';
import OrgTableTest from '../../../mock/Organization.json';

const testData: TableProps = {
    columns: [
        { title: 'Name', field: 'name' },
        { title: 'Low', field: 'low' },
        { title: 'Moderate', field: 'moderate' },
        { title: 'High', field: 'high' },
        { title: 'Critical', field: 'critical' },
    ],
    rows: OrgTableTest.data,
    filters: [],
    title: 'Teams within this organization',
    onRowClick: () => {}
}

export const Organization = ({} : {}) => {
    const navigate = useNavigate();

    let handleClick = (event: React.MouseEvent, rowData: any) => {
        navigate(`${window.location.pathname}/team/${rowData.name}`, { replace: true });
    }

    const cols = testData.columns
    const rows = testData.rows
    const filters = testData.filters
    const title = testData.title
    return (
        <>
            <h1>Organization</h1>
            <DataView columns={cols} rows={rows} filters={filters} title={title} onRowClick={handleClick}/>
        </>
    );
};
