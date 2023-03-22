import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { InfoCard } from "@backstage/core-components";
import { configure, shallow } from 'enzyme';
import { VulnList } from '.';
import React from 'react';
import { VulnInfoFormatted } from '../../utils/types';
import { VulnCard } from '../VulnCard';

configure({adapter: new Adapter()});

describe('Vuln List test suite', () => {
    describe('When it is given valid props', () => {
        const props: VulnInfoFormatted[] = [{
            packageName: 'Test Package',
            versionNum: '1.1.1',
            createdAt: '01/01/0001', 
            pullRequest: 'NO',
            dismissedAt: '01/01/0001',
            fixedAt: '01/01/0001',
            vulnVersionRange: '1.0.0-1.1.0',
            classification: 'GENERAL',
            severity: 'critical',
            summary: 'test vulnerability',
            vulnerabilityCount: 1,
            state: 'OPEN',
        },{
            packageName: 'Test Package 2',
            versionNum: '2.2.2',
            createdAt: '02/02/0002', 
            pullRequest: 'NO',
            dismissedAt: '02/02/0002',
            fixedAt: '02/02/0002',
            vulnVersionRange: '2.0.0-2.2.0',
            classification: 'GENERAL',
            severity: 'critical',
            summary: 'test vulnerability',
            vulnerabilityCount: 2,
            state: 'OPEN',
        }];

        it('should render', () => {
            const wrapper = shallow(<VulnList vulns={props}/>);
            expect(wrapper.find(<></>)).toBeTruthy();
        });

        it('should show all given vulns', () => {
            const wrapper = shallow(<VulnList vulns={props}/>);
            expect(wrapper.find(VulnCard)).toHaveLength(2);
        });
    })

    describe('When it is not given valid props', () => {
        it('Returns an empty element when props are empty', () => {
            const wrapper = shallow(<VulnList vulns={[]}/>);
            expect(wrapper.find(VulnCard)).toHaveLength(0);
        });
    })
});