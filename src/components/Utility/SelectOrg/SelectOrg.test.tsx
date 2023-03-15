import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderInTestApp } from "@backstage/test-utils";
import { configure } from 'enzyme';
import { SelectOrg } from '.';
import React from 'react';

// This is necessary to mock useNavigate 
// and to avoid issues with testing hooks
configure({adapter: new Adapter()});

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));

jest.mock('../../api/useGetOrganizationsForUser');
const useGetOrgs = require('../../api/useGetOrganizationsForUser');

describe('SelectOrg test suite', () => {
    let testData: any[];

    beforeEach(() => {
        testData = [{name: 'test org'}, {name: 'test org 2'}];
        jest.spyOn(useGetOrgs, 'useGetOrgsForUser')
            .mockImplementation(() => Promise.resolve(testData));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render', async () => {
        await renderInTestApp(<SelectOrg />);
        expect(await screen.findByText('Organization Name')).toBeVisible();
    });

    it('should render an option per org found', async () => {
        const wrapper = await renderInTestApp(<SelectOrg />);
        const Select = wrapper.getByRole('button');
        await userEvent.click(Select);
        const Options = wrapper.getAllByRole('option');

        // Extra item for None option
        expect(Options.length).toEqual(testData.length + 1); 
    });

    it('should select the correct value if defaultOption is given', async () => {
        const wrapper = await renderInTestApp(<SelectOrg defaultOption='test org 2'/>);
        const Select = wrapper.getByRole('button');
        expect(Select.textContent).toEqual('test org 2');
    })

    it('should redirect to the org page if value is selected', async () => {
        const wrapper = await renderInTestApp(<SelectOrg />);

        const Select = wrapper.getByRole('button');
        await userEvent.click(Select);
        const listbox = within(wrapper.getByRole('listbox'));
        const target = listbox.getByText('test org');
        await userEvent.click(target);
        
        expect(mockedUsedNavigate).toHaveBeenCalledWith(`./test org`, { replace: true });
    });

    // an undefined value just means the user clicked away from it
    it('should not redirect if select value is undefined', async () => {
        const wrapper = await renderInTestApp(<SelectOrg />);
        const Select = wrapper.getByRole('button');
        await userEvent.click(Select);
        await userEvent.click(document.body);
        expect(mockedUsedNavigate).not.toHaveBeenCalled();
    });
});