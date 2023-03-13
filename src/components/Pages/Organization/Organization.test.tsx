import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { screen } from '@testing-library/react';
import { renderInTestApp } from "@backstage/test-utils";
import { useGetTeamsForOrg } from '../../../api/useGetTeamsForOrg';
import { configure, shallow } from 'enzyme';
import { Organization } from '.';
import React from 'react';

// This is necessary to mock useNavigate 
// and to avoid issues with testing hooks
configure({adapter: new Adapter()});

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));

// Mocks the internal API call with a test return object 
jest.mock('../../../api/useGetTeamsForOrg', () => ({
    useGetTeamsForOrg: jest.fn().mockImplementation((name, limit) => 
        Promise.resolve([{ name: 'test'}]))
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
        const wrapper = shallow(<Organization />);
        expect(wrapper.contains(<h1>Organization</h1>)).toBeTruthy();
    });

    it('should display a table when data is received from backend', async () => {
        await renderInTestApp(<Organization />);
        expect(await screen.findByText('Teams within this organization')).toBeVisible();
        expect(await screen.findByText('test')).toBeVisible();
    })
});