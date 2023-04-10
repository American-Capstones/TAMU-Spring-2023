import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, shallow } from 'enzyme';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import React from 'react';
import { BarGraphData, LineGraphData } from '../../utils/types';
import { Graphs } from './Graphs';

configure({ adapter: new Adapter() });

class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}

describe('Graphs test suite', () => {
    window.ResizeObserver = ResizeObserver;
    const barData: BarGraphData[] = [{ severity: 'Critical', count: 20 }, { severity: 'Low', count: 200 }]
    const lineData: LineGraphData[] = [{ id: 'Critical', data: [{ x: 'Jan', y: 4 }, { x: 'Jun', y: 15 }] }];
    const ComponentWithData = <Graphs lineData={lineData} barData={barData} />;

    it('should render a bar graph', async () => {
        const wrapper = shallow(ComponentWithData);
        expect(wrapper.find(ResponsiveBar)).toHaveLength(1);
    })

    it('should render a line graph', async () => {
        const wrapper = shallow(ComponentWithData);
        expect(wrapper.find(ResponsiveLine)).toHaveLength(1);
    })
});