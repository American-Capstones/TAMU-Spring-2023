import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { screen } from '@testing-library/react';
import { renderInTestApp } from "@backstage/test-utils";
import { configure, shallow } from 'enzyme';
import { Team } from '.';
import React from 'react';
import * as useGetRepos from '../../../api/useGetRepositoriesForTeam';

// This is necessary to avoid issues testing components w/ hooks
configure({adapter: new Adapter()});

const mockedUseGetRepos = useGetRepos as { useGetRepositoriesForTeam: any }
const mockedUseNav = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUseNav,
    useParams: () => ({
        teamName: 'test_team',
    }),
}));

// Mocks the internal API call with a test return object 
jest.mock('../../../api/useGetRepositoriesForTeam', () => ({
    useGetRepositoriesForTeam: () => Promise.resolve([{ name: 'test'}])
}));

// Needed when fully rendering a Responsive element from Nivo
class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

describe('Organization page test suite', () => {
    window.ResizeObserver = ResizeObserver;
    it('should render', async () => {
        const wrapper = shallow(<Team />);
        expect(wrapper.contains(<h1>Team</h1>)).toBeTruthy();
    });

    it('should display a table if teamName exists', async () => {
        mockedUseGetRepos.useGetRepositoriesForTeam = () => [{name: 'test'}];
        await renderInTestApp(<Team />);
        expect(await screen.findByText('Repository Name')).toBeVisible();
        expect(await screen.findByText('test')).toBeVisible();
    })

    // it('should redirect to organization page if teamName doesnt exist', async () => {
    //     mockedUseGetRepos.useGetRepositoriesForTeam = () => [{}];
    //     await renderInTestApp(<Team />);
    //     expect(mockedUseNav).toBeCalled();
    // })
});