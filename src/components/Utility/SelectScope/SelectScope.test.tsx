import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderInTestApp } from "@backstage/test-utils";
import { configure } from 'enzyme';
import { SelectScope } from '.';
import React from 'react';

// This is necessary to mock useNavigate 
// and to avoid issues with testing hooks
configure({ adapter: new Adapter() });

describe('SelectScope test suite', () => {
    const mockClick = jest.fn();
    const Component = <SelectScope handleClick={mockClick} />
    const ComponentWithDefault = <SelectScope handleClick={mockClick} defaultOption='repositories' />

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render', async () => {
        await renderInTestApp(Component);
        expect(await screen.findByLabelText('scope select')).toBeVisible();
    });

    it('should render an option scope available', async () => {
        // These scopes are defined as Teams, Topics, and Repositories

        const wrapper = await renderInTestApp(Component);
        const Teams = wrapper.getByLabelText('teams');
        const Topics = wrapper.getByLabelText('topics');
        const Repos = wrapper.getByLabelText('repositories');
        expect(Teams).toBeVisible();
        expect(Topics).toBeVisible();
        expect(Repos).toBeVisible();
    });

    it('should select the correct value if defaultOption is given', async () => {
        const wrapper = await renderInTestApp(ComponentWithDefault);
        const Repos = wrapper.getByLabelText('repositories');
        const Teams = wrapper.getByLabelText('teams');
        expect(Repos).toHaveAttribute('aria-pressed', 'true');
        expect(Teams).toHaveAttribute('aria-pressed', 'false');
    })

    it('should call the handleClick prop when option is chosen', async () => {
        const wrapper = await renderInTestApp(Component);

        const Topics = wrapper.getByLabelText('topics');
        await userEvent.click(Topics);
        const repos = wrapper.getByLabelText('repositories');
        await userEvent.click(repos);

        expect(mockClick).toHaveBeenCalledTimes(2);
    });
});