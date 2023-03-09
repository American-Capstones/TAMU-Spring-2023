import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { DataView, TableProps } from '../DataView';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen } from '@testing-library/react';
import OrgTableTest from '../../mock/Organization.json';
import {
  setupRequestMockHandlers,
  renderInTestApp,
} from "@backstage/test-utils";
import { configure, mount, shallow } from 'enzyme';
import { Table } from '@backstage/core-components';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';



configure({adapter: new Adapter()});

describe('ExampleComponent', () => {
    const server = setupServer();
    // Enable sane handlers for network requests
    setupRequestMockHandlers(server);

    // setup mock response
    beforeEach(() => {
        server.use(
            rest.get('/*', (_, res, ctx) => res(ctx.status(200), ctx.json({}))),
        );
    });

    const emptyProps: TableProps = {
        columns: [],
        rows: [],
        filters: [],
        title: '',
        onRowClick: () => {}
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
        onRowClick: () => {}
    };
    const ComponentWithData = DataView(input);
    const EmptyComponent = DataView;

    it('should render when given data', async () => {        
        await renderInTestApp(ComponentWithData);
        expect(screen.getByText('Teams within this organization')).toBeInTheDocument();
    });

    it('should thow error when no props are given', async () => {
        expect(() => render(EmptyComponent(emptyProps))).toThrow(Error);
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