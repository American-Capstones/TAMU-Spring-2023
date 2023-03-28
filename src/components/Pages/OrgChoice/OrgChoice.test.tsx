import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, shallow } from 'enzyme';
import { OrgChoice } from '.';
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

jest.mock('../../../hooks/useGetOrgsForUser', () => ({
    ...jest.requireActual('../../../hooks/useGetOrgsForUser'),
    useGetOrgsForUser: jest.fn().mockReturnValue({ loading: false, orgs: ['test org', 'test org 2']})
}));

describe('OrgChoice test suite', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render', async () => {
        const wrapper = shallow(<OrgChoice />);
        expect(wrapper.contains(<h1>Please select an organization to continue:</h1>)).toBeTruthy();
    });
    
    it('should show an OrgSelect element', () => {
        const wrapper = shallow(<OrgChoice />);
        expect(wrapper.contains(<SelectOrg />)).toBeTruthy();
    });
});