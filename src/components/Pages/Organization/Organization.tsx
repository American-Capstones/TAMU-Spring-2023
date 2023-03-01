import React from 'react';
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
    filters: []
}

export const Organization = ({} : {}) => {

    const cols = testData.columns
    const rows = testData.rows
    const filters = testData.filters
    return (
        <>
            <h1>Organization</h1>
            <DataView columns={cols} rows={rows} filters={filters}/>
        </>
    );
};
