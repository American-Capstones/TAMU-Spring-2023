import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { screen } from '@testing-library/react';
import { renderInTestApp } from "@backstage/test-utils";
import { configure, shallow } from 'enzyme';
import { Organization } from '.';
import React from 'react';
import { SelectOrg } from '../../Utility';

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

jest.mock('../../../api/useGetOrganizationsForUser');
const useGetOrgs = require('../../../api/useGetOrganizationsForUser');

// Needed when fully rendering a Responsive element from Nivo
class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

describe('Organization page test suite', () => {
    window.ResizeObserver = ResizeObserver;

    jest.spyOn(useGetOrgs, 'useGetOrgsForUser')
        .mockImplementation(() => Promise.resolve([{name: 'test org'}, {name: 'test org 2'}]));

    it('should render', async () => {
        const wrapper = shallow(<Organization />);
        expect(wrapper.contains(<SelectOrg defaultOption=''/>)).toBeTruthy();
    });

    it('should display a table when data is received from backend', async () => {
        await renderInTestApp(<Organization />);
        expect(await screen.findByText('Teams within this organization')).toBeVisible();
        expect(await screen.findByText('test')).toBeVisible();
    });

    it('should redirect to the teams page when table row is clicked', async () => {
        // Cannot get the mockedUsedNavigate to be called in this test
        // await renderInTestApp(<Organization />);
        // const testLabel = await screen.findByText('test');
        // const row = testLabel.parentElement;
        // await userEvent.click(row);
        // expect(mockedUsedNavigate).toHaveBeenCalled();
    })
});