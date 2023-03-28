import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { screen } from '@testing-library/react';
import { renderInTestApp } from "@backstage/test-utils";
import { configure, shallow } from 'enzyme';
import { Team } from '.';
import React from 'react';
import { useNavigate } from 'react-router-dom';

// This is necessary to avoid issues testing components w/ hooks
configure({adapter: new Adapter()});

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: jest.fn().mockReturnValue({ orgName: 'TEST ORG', teamName: 'TEST TEAM' })
}));

jest.mock('../../../hooks/useGetReposFromTeam', () => ({
    ...jest.requireActual('../../../hooks/useGetReposFromTeam'),
    useGetReposFromTeam: jest.fn().mockReturnValue({ loading: false, repos: [{ id: 'test_id', name: 'test_name'}]})
}));

// Needed when fully rendering a Responsive element from Nivo
class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

describe('Team page test suite', () => {
    window.ResizeObserver = ResizeObserver;

    it('should render', async () => {
        const wrapper = shallow(<Team />);
        expect(wrapper.contains(<h1>Team</h1>)).toBeTruthy();
    });

    it('should display DataView component', async () => {
        await renderInTestApp(<Team />);
        // easiest to detect DataView component by looking for table rows
        expect(await screen.findByText('Repository Name')).toBeVisible();
        expect(await screen.findByText('test_name')).toBeVisible();
    });

    it('should navigate to repo page when row is clicked in table', async () => {
        // todo: not sure how to click on a row; see Organization.test.tsx
    });

    it('should redirect to organization page and show error if teamName doesnt exist', async () => {
        // todo: waiting on error component before finishing this test
    })
});