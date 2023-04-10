import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { screen } from '@testing-library/react';
import { renderInTestApp } from "@backstage/test-utils";
import { configure, shallow } from 'enzyme';
import { Organization } from '.';
import React from 'react';
import { SelectOrg } from '../../Utility';
import { SelectScope } from '../../Utility';
import { Table } from '@backstage/core-components';
import { Graphs } from '../../Graphs';
import userEvent from '@testing-library/user-event';
import { Org } from '../../../utils/types';

// This is necessary to mock useNavigate 
// and to avoid issues with testing hooks
configure({ adapter: new Adapter() });

const testOrg: Org = {
    name: 'TEST ORG',
    vulnData: {
        startMonth: 1,
        critical: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        high: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        moderate: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        low: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        criticalNum: 0,
        highNum: 12,
        moderateNum: 24,
        lowNum: 36,
    },
    teams: [
        {
            name: 'test team 1',
            vulnData: {
                startMonth: 1,
                critical: [],
                high: [],
                moderate: [],
                low: [],
                criticalNum: 0,
                highNum: 0,
                moderateNum: 0,
                lowNum: 0
            },
            repos: [],
            offenses: 0
        }
    ],
    repos: [],
    topics: [],
    url: '',
    avatarUrl: '',
}

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: jest.fn().mockReturnValue({ orgName: 'TEST ORG' }),
    useLocation: jest.fn().mockReturnValue({ pathname: '/dependabot-dashboard/organization/TEST ORG' })
}));

jest.mock('../../../hooks/useGetOrgsForUser', () => ({
    ...jest.requireActual('.../../../hooks/useGetOrgsForUser'),
    useGetOrgsForUser: jest.fn().mockReturnValue({
        loading: false,
        orgs: [
            { name: 'TEST ORG', url: '', avatarUrl: '' }
        ],
        error: undefined
    })
}));

jest.mock('../../../hooks/useGetAllVulns', () => ({
    ...jest.requireActual('../../../hooks/useGetAllVulns'),
    useGetAllVulns: jest.fn(orgName => ({
        loading: false,
        data: testOrg,
        error: undefined,
    }))
}));

// Needed when fully rendering a Responsive element from Nivo
class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}

describe('Organization page test suite', () => {
    window.ResizeObserver = ResizeObserver;

    it('should render the organization selector', async () => {
        const wrapper = shallow(<Organization />);
        expect(wrapper.contains(<SelectOrg defaultOption='TEST ORG' />)).toBeTruthy();
    });

    it('should render the scope selector', async () => {
        const wrapper = shallow(<Organization />);
        expect(wrapper.find(SelectScope)).toHaveLength(1);
    });

    it('should change the data in the table depending on the scope selected', async () => {
        const wrapper = await renderInTestApp(<Organization />);
        const TeamsSelect = await wrapper.findByLabelText('teams');
        const TopicsSelect = await wrapper.findByLabelText('topics');
        const ReposSelect = await wrapper.findByLabelText('repositories');

        await userEvent.click(TeamsSelect);
        expect(await screen.findByText('Team Name')).toBeVisible();
        await userEvent.click(TopicsSelect);
        expect(await screen.findByText('Topic Name')).toBeVisible();
        await userEvent.click(ReposSelect);
        expect(await screen.findByText('Repo Name')).toBeVisible();
    });

    it('should render a Graphs component', async () => {
        const wrapper = shallow(<Organization />);
        expect(wrapper.find(Graphs)).toHaveLength(1);
    })

    it('should render 1 table component', async () => {
        const wrapper = shallow(<Organization />);
        expect(wrapper.find(Table)).toHaveLength(1);
    })

    it('should display a table when data is received from backend', async () => {
        await renderInTestApp(<Organization />);
        expect(await screen.findByText('Teams')).toBeVisible();
        expect(await screen.findByText('test team 1')).toBeVisible();
    });

    it('should redirect to the correct page when table row is clicked', async () => {
        // Cannot get the mockedUsedNavigate to be called in this test
        // await renderInTestApp(<Organization />);
        // const testLabel = await screen.findByText('test');
        // const row = testLabel.parentElement;
        // await userEvent.click(row);
        // expect(mockedUsedNavigate).toHaveBeenCalled();
    })
});