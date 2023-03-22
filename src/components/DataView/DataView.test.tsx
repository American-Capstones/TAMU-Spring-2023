import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { DataView, TableProps } from '.';
import { screen } from '@testing-library/react';
import OrgTableTest from '../../mock/Organization.json';
import { renderInTestApp } from "@backstage/test-utils";
import { configure, shallow } from 'enzyme';
import { Table } from '@backstage/core-components';
import { ErrorPage } from '@backstage/core-components';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import React from 'react';

configure({adapter: new Adapter()});

describe('DataView test suite', () => {
    const emptyProps: TableProps = {
        columns: [],
        rows: [],
        filters: [],
        title: '',
        onRowClick: () => {},
        emptyContent: <></>
    }
    const input: TableProps = {
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
        onRowClick: () => {},
        emptyContent: <></>
    };
    const ComponentWithData = DataView(input);
    const EmptyComponent = DataView(emptyProps);

    it('should only render error page when given empty props', async () => {
        await renderInTestApp(EmptyComponent);
        expect(screen.getByTestId('error')).toBeInTheDocument();
    })

    it('should not render the error page when given correct props', async () => {
        const wrapper = shallow(ComponentWithData);

        expect(wrapper.find(ResponsiveBar)).toHaveLength(1);
        expect(wrapper.find(ResponsiveLine)).toHaveLength(1);
        expect(wrapper.find(Table)).toHaveLength(1);
        
        expect(wrapper.find(ErrorPage)).toHaveLength(0);
    })

    it('should render a bar graph', async () => {
        const wrapper = shallow(ComponentWithData);
        expect(wrapper.find(ResponsiveBar)).toHaveLength(1);
    })

    it('should render a line graph', async () => {
        const wrapper = shallow(ComponentWithData);
        console.log(wrapper.find(ResponsiveLine))
        expect(wrapper.find(ResponsiveLine)).toHaveLength(1);
    })

    it('should render a table component', async () => {
        const wrapper = shallow(ComponentWithData);
        expect(wrapper.find(Table)).toHaveLength(1);
    })
});