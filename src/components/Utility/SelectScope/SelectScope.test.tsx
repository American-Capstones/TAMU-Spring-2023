import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderInTestApp } from "@backstage/test-utils";
import { configure } from 'enzyme';
import { SelectScope } from '.';
import React from 'react';

// This is necessary to mock useNavigate 
// and to avoid issues with testing hooks
configure({adapter: new Adapter()});

describe('SelectScope test suite', () => {
    const mockClick = jest.fn();
    const Component = <SelectScope handleClick={mockClick} title='Test Title' />
    const ComponentWithDefault = <SelectScope handleClick={mockClick} title='Test Title' defaultOption='teams' />

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render', async () => {
        await renderInTestApp(Component);
        expect(await screen.findByText('Test Title')).toBeVisible();
    });

    it('should render an option per item found', async () => {
        const wrapper = await renderInTestApp(Component);
        const Select = wrapper.getByRole('button');
        await userEvent.click(Select);
        const Options = wrapper.getAllByRole('option');

        // Extra item for None option, + orgs length
        expect(Options.length).toEqual(2); 
    });

    it('should select the correct value if defaultOption is given', async () => {
        const wrapper = await renderInTestApp(ComponentWithDefault);
        const Select = wrapper.getByRole('button');
        expect(Select.textContent).toEqual('Teams');
    })

    it('should call the handleClick prop when option is chosen', async () => {
        const wrapper = await renderInTestApp(Component);

        const Select = wrapper.getByRole('button');
        await userEvent.click(Select);
        const listbox = within(wrapper.getByRole('listbox'));
        const repos = listbox.getByText('Repositories');
        await userEvent.click(repos);
        const teams = listbox.getByText('Teams');
        await userEvent.click(teams);
        
        expect(mockClick).toHaveBeenCalledTimes(2);
    });
});