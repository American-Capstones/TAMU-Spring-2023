import React, { useState } from 'react';
import { DataView } from '../../DataView';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetRepositoriesForTeam } from '../../../api/useGetRepositoriesForTeam';
import { Repository } from '../../../utils/types';
import ReactLoading from "react-loading";

const emptyContent = () => {
    return (
        <h1>This team has no associated repositories</h1>
    )
}

export const Team = ({} : {}) => {
    let { teamName } = useParams();
    const [tableData, setTableData] = useState<Repository[]>([])
    const navigate = useNavigate();
    const [ done, setDone ] = useState(false);

    if (tableData.length == 0 && teamName) {
        useGetRepositoriesForTeam('baggage-claim-incorporated', teamName, 10)
        .then((data: any) => {
            setTableData(data);
            setDone(true);
        })
        .catch((e) => {
            // Need to add more specific error checking here.
            // For now, i'll assume that an error means
            // that the team doesn't exist
            navigate(`../`, { replace: true });
        });
    }

    const goToRepo = (event: React.MouseEvent | undefined, rowData: any) => {
        navigate(`../repos/${rowData.name}`, { replace: true });
    }

    if (!done) {
        return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}> <ReactLoading 
          type={"spin"}
          color={"#8B0000"}
          height={100}
          width={100}
        />
        </div>
    }

    const cols = [{title: 'Repository Name', field: 'name'}]
    const rows = tableData;
    const filters: any[] = [];
    const title = `Repositories under ${teamName}`;
    return (
        <>
            <h1>Team</h1>
            {teamName != ':teamName' && teamName != undefined ?
                <DataView
                    columns={cols}
                    rows={rows}
                    filters={filters}
                    title={title}
                    onRowClick={goToRepo}
                    emptyContent={emptyContent}/>
                :
                <h1>Error - this team does not exist.</h1>
            }
        </>
    );
};
