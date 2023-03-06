import { TableColumn, TableFilter } from '@backstage/core-components';

export type TableProps = {
    columns: TableColumn[],
    rows: any[],
    filters: TableFilter[],
    title: string,
    onRowClick: (event: React.MouseEvent | undefined, rowData: any) => void
};