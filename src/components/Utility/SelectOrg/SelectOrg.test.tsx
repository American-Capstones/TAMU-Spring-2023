import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderInTestApp } from "@backstage/test-utils";
import { configure } from 'enzyme';
import { SelectOrg } from '.';
import React from 'react';
import { useGetOrgsForUser } from '../../../hooks/useGetOrgsForUser';

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

describe('SelectOrg test suite', () => {

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

        // Extra item for None option, + orgs length
        expect(Options.length).toEqual(3); 
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
        
        expect(mockedUsedNavigate).toHaveBeenCalledWith(`../test org`, { replace: true });
    });

    // an undefined value just means the user clicked away from it
    it('should not redirect if select value is undefined', async () => {
        const wrapper = await renderInTestApp(<SelectOrg />);
        const Select = wrapper.getByRole('button');
        await userEvent.click(Select);
        await userEvent.click(document.body);
        expect(mockedUsedNavigate).not.toHaveBeenCalled();
    });

    it('should disable the "None" option when it is not selected', async () => {
        const wrapper = await renderInTestApp(<SelectOrg />);

        const Select = wrapper.getByRole('button');
        await userEvent.click(Select);
        const listbox = within(wrapper.getByRole('listbox'));
        const target = listbox.getAllByRole('option')[0];
        expect(target.className).toContain('Mui-disabled')
    })
});