import { TableColumn, TableFilter } from '@backstage/core-components';

export type TableProps = {
    columns: TableColumn[],
    rows: any[],
    filters: TableFilter[]
};