import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { screen } from '@testing-library/react';
import { renderInTestApp } from "@backstage/test-utils";
import { configure, shallow } from 'enzyme';
import { TopicPage } from '.';
import React from 'react';
import { Graphs } from '../../Graphs';
import { Table } from '@backstage/core-components';
import { Topic } from '../../../utils/types';

// This is necessary to avoid issues testing components w/ hooks
configure({ adapter: new Adapter() });

const testTopic: Topic =
{
    name: 'test topic 1',
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
    ]
}

jest.mock('../../../hooks/useGetTopicVulns', () => ({
    ...jest.requireActual('../../../hooks/useGetTopicVulns'),
    useGetTopicVulns: jest.fn((orgName, topicName) => ({
        loading: false,
        data: testTopic,
        error: undefined,
    }))
}));


jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: jest.fn().mockReturnValue({ orgName: 'TEST ORG', topicName: 'test topic 1' }),
    useLocation: jest.fn().mockReturnValue({ pathname: '/dependabot-dashboard/TEST ORG/team/test topic 1' })
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
        const wrapper = shallow(<TopicPage />);
        expect(wrapper.children).not.toBeNull();
    });

    it('should render a Graphs component', async () => {
        const wrapper = shallow(<TopicPage />);
        expect(wrapper.find(Graphs)).toHaveLength(1);
    })

    it('should render a table component', async () => {
        const wrapper = shallow(<TopicPage />);
        expect(wrapper.find(Table)).toHaveLength(1);
    })

    it('should display a table when data is received from backend', async () => {
        await renderInTestApp(<TopicPage />);
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