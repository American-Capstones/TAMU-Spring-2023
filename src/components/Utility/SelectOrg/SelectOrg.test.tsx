import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderInTestApp } from "@backstage/test-utils";
import { configure } from 'enzyme';
import { SelectOrg } from '.';
import React from 'react';
import { useGetOrgsForUser } from '../../../hooks/useGetOrgsForUser';

// This is necessary to mock useNavigate 
// and to avoid issues with testing hooks
configure({adapter: new Adapter()});

const testOrg = {
    name: 'test org 2',
    avatarUrl: 'test avatar url',
    url: 'test url',
}

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));

jest.mock('../../../hooks/useGetOrgsForUser', () => ({
    ...jest.requireActual('../../../hooks/useGetOrgsForUser'),
    useGetOrgsForUser: jest.fn().mockReturnValue({ loading: false, orgs: [{
        name: 'test org', 
        url: 'test url 1',
        avatarUrl: 'test url 1',
    },
    {
        name: 'test org 2',
        url: 'test url 2',
        avatarUrl: 'test url 2',
    }]})
}));

describe('SelectOrg test suite', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render', async () => {
        await renderInTestApp(<SelectOrg />);
        expect(await screen.findByLabelText('Organization')).toBeVisible();
    });

    it('should render an option per org found', async () => {
        const wrapper = await renderInTestApp(<SelectOrg />);
        const Select = wrapper.getByRole('button');
        await userEvent.click(Select);
        const Options = wrapper.getAllByRole('option');

        // orgs length
        expect(Options.length).toEqual(2); 
    });

    it('should select the correct value if defaultOption is given', async () => {
        const wrapper = await renderInTestApp(<SelectOrg defaultOption='test org 2'/>);
        const input = await wrapper.getByRole('combobox');
        expect(input).toHaveAttribute('value', 'test org 2');
    })

    it('should redirect to the org page if value is selected', async () => {
        const wrapper = await renderInTestApp(<SelectOrg />);
        const autocomplete = wrapper.getByTestId('autocomplete');
        const input = wrapper.getByRole('combobox');
        await userEvent.click(input);
        autocomplete.focus();
        
        fireEvent.keyDown(autocomplete, { key: 'ArrowDown' })
        fireEvent.keyDown(autocomplete, { key: 'Enter' })
        expect(mockedUsedNavigate).toHaveBeenCalledWith(`../test org 2`, { replace: true });
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