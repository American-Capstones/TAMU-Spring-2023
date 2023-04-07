import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { screen } from '@testing-library/react';
import { renderInTestApp } from "@backstage/test-utils";
import { configure, shallow } from 'enzyme';
import { TeamPage } from '.';
import React from 'react';
import { Graphs } from '../../Graphs';
import { Table } from '@backstage/core-components';
import { Team } from '../../../utils/types';

// This is necessary to avoid issues testing components w/ hooks
configure({ adapter: new Adapter() });

const testTeam: Team =
{
    name: 'test team 1',
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
    repos: [
        {
            id: 'abc',
            name: 'test repo 1',
            low: 36,
            moderate: 24,
            high: 12,
            critical: 0,
            repositoryTopics: [''],
        }
    ],
    offenses: 0
}

jest.mock('../../../hooks/useGetTeamVulns', () => ({
    ...jest.requireActual('../../../hooks/useGetTeamVulns'),
    useGetTeamVulns: jest.fn((orgName, teamName) => ({
        loading: false,
        data: testTeam,
        error: undefined,
    }))
}));


jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: jest.fn().mockReturnValue({ orgName: 'TEST ORG', teamName: 'TEST TEAM' }),
    useLocation: jest.fn().mockReturnValue({ pathname: '/dependabot-dashboard/TEST ORG/team/test team 1' })
}));

// Needed when fully rendering a Responsive element from Nivo
class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}

describe('Team page test suite', () => {
    window.ResizeObserver = ResizeObserver;

    it('should render', async () => {
        const wrapper = shallow(<TeamPage />);
        expect(wrapper.contains(<h1>TEST TEAM</h1>)).toBeTruthy();
    });

    it('should render a Graphs component', async () => {
        const wrapper = shallow(<TeamPage />);
        expect(wrapper.find(Graphs)).toHaveLength(1);
    })

    it('should render a table component', async () => {
        const wrapper = shallow(<TeamPage />);
        expect(wrapper.find(Table)).toHaveLength(1);
    })

    it('should display a table when data is received from backend', async () => {
        await renderInTestApp(<TeamPage />);
        expect(await screen.findByText('Repositories')).toBeVisible();
        expect(await screen.findByText('test repo 1')).toBeVisible();
    });

    it('should navigate to repo page when row is clicked in table', async () => {
        // todo: not sure how to click on a row; see Organization.test.tsx
    });

    it('should redirect to organization page and show error if teamName doesnt exist', async () => {
        // todo: waiting on error component before finishing this test
    })
});