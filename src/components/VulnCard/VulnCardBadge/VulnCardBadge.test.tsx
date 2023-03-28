import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, shallow } from 'enzyme';
import { VulnCardBadge } from './VulnCardBadge';
import React from 'react';
import { Tooltip } from '@material-ui/core';
import { green, grey } from '@material-ui/core/colors';
import { SecurityOutlined, VerifiedUserOutlined } from '@material-ui/icons';

configure({ adapter: new Adapter() });

// Test for <VulnCardBadge />
describe('VulnCardBadge Test Suite', () => {

    /* When there is no pull request, it should return <></> */
    describe('When a valid state is given', () => {
        it('renders correct icon when state is \'open\'', () => {
            const wrapper = shallow(<VulnCardBadge state={'OPEN'} />);
            expect(wrapper.contains(
                <SecurityOutlined style={{ color: grey[600] }} />
            )).toBeTruthy();
        })

        it('renders correct icon when state is \'fixed\'', () => {
            const wrapper = shallow(<VulnCardBadge state={'FIXED'} />);
            expect(wrapper.contains(
                <VerifiedUserOutlined style={{ color: green[600] }} />
            )).toBeTruthy();
        })

        it('renders correct icon when state is \'dismissed\'', () => {
            const wrapper = shallow(<VulnCardBadge state={'DISMISSED'} />);
            expect(wrapper.contains(
                <SecurityOutlined style={{ color: grey[600] }} />
            )).toBeTruthy();
        })

        it('renders correct icon when state is lowercase', () => {
            const wrapper = shallow(<VulnCardBadge state={'open'}/>);
            expect(wrapper.contains(
                <SecurityOutlined style={{ color: grey[600] }} />
            )).toBeTruthy();
        })

        it('renders correct icon when state is mixed case', () => {
            const wrapper = shallow(<VulnCardBadge state={'oPeN'}/>);
            expect(wrapper.contains(
                <SecurityOutlined style={{ color: grey[600] }} />
            )).toBeTruthy();
        })

        it('should not render when there is no state', () => {
            const wrapper = shallow(<VulnCardBadge state=''/>);
            expect(wrapper.find(Tooltip)).toHaveLength(0);
        })
    })
})
