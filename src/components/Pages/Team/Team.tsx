import React from 'react';
import { DataView, TableProps } from '../../DataView';
import TeamTableTest from '../../../mock/Organization.json';
import { useParams } from 'react-router-dom';

const testData: TableProps = {
    columns: [
        { title: 'Name', field: 'name' },
        { title: 'Low', field: 'low' },
        { title: 'Moderate', field: 'moderate' },
        { title: 'High', field: 'high' },
        { title: 'Critical', field: 'critical' },
    ],
    rows: TeamTableTest.data,
    filters: [],
    title: '',
    onRowClick: () => {}
}

export const Team = ({} : {}) => {
    const { teamName } = useParams();

    // todo: This is where we should do some checking to make sure that the team actually exists within the github organization.
    // todo: if it does not exist, we can just set teamName to undefined and it will generate the correct error message.

    // of less importance, but it might be beneficial to design a standardized error styling system across our plugin.

    const cols = testData.columns
    const rows = testData.rows
    const filters = testData.filters
    return (
        <>
            <h1>Team</h1>
            {teamName != ':teamName' && teamName != undefined ?
                <DataView columns={cols} rows={rows} filters={filters} title={`Repositories for team ${teamName}`}/>
                :
                <h1>Error - this team does not exist.</h1>
            }
        </>
    );
};
