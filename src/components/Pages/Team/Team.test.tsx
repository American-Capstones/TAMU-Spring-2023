import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { screen } from '@testing-library/react';
import { renderInTestApp } from "@backstage/test-utils";
import { configure, shallow } from 'enzyme';
import { Team } from '.';
import React from 'react';

// This is necessary to avoid issues testing components w/ hooks
configure({adapter: new Adapter()});
const useGetRepos = require('../../../api/useGetRepositoriesForTeam');
const dom = require('react-router-dom');

const mockedUseNav = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUseNav,
}));

jest.mock('../../../api/useGetRepositoriesForTeam');

// Needed when fully rendering a Responsive element from Nivo
class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

describe('Team page test suite', () => {
    window.ResizeObserver = ResizeObserver;

    beforeEach(() => {
        jest.spyOn(useGetRepos, 'useGetRepositoriesForTeam')
            .mockImplementation((org, name, limit) => Promise.resolve([{ name: 'test'}]));
        jest.spyOn(dom, 'useParams').mockImplementation(() => {
            return { teamName: 'test_team' }
        })
    })

    it('should render', async () => {
        const wrapper = shallow(<Team />);
        expect(wrapper.contains(<h1>Team</h1>)).toBeTruthy();
    });

    it('should display a table', async () => {
        await renderInTestApp(<Team />);
        expect(await screen.findByText('Repository Name')).toBeVisible();
        expect(await screen.findByText('test')).toBeVisible();
    })

    it('should navigate to repo page when row is clicked in table', async () => {
        // todo: not sure how to click on a row; see Organization.test.tsx
    });

    it('should redirect to organization page if teamName doesnt exist', async () => {
        jest.spyOn(useGetRepos, 'useGetRepositoriesForTeam').mockImplementation(
            () => Promise.reject(undefined));
        await renderInTestApp(<Team />);
        expect(mockedUseNav).toHaveBeenCalledWith('../', { replace: true });
    })
});