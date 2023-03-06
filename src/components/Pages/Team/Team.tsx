import React from 'react';
import { DataView, TableProps } from '../../DataView';
import TeamTableTest from '../../../mock/Organization.json';
import { useNavigate, useParams } from 'react-router-dom';

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
    const navigate = useNavigate();

    // todo: This is where we should do some checking to make sure that the team actually exists within the github organization.
    // todo: if it does not exist, we can just set teamName to undefined and it will generate the correct error message.

    // This will change! teamRows is the data fed to teams table. So should be repo info for a given team.
    const teamRows = testData?.rows.filter(row => row.name == teamName);

    // of less importance, but it might be beneficial to design a standardized error styling system across our plugin.

    const goToRepo = (event: React.MouseEvent | undefined, rowData: any) => {
        navigate(`../repos/${rowData.name}`, { replace: true });
    }

    const cols = testData.columns
    const rows = teamRows ? teamRows : testData.rows
    const filters = testData.filters
    return (
        <>
            <h1>Team</h1>
            {teamName != ':teamName' && teamName != undefined ?
                <DataView columns={cols} rows={rows} filters={filters} title={`Repositories for team ${teamName}`} onRowClick={goToRepo}/>
                :
                <h1>Error - this team does not exist.</h1>
            }
        </>
    );
};
