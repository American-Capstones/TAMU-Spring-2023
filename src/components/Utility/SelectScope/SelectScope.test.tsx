import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderInTestApp } from '@backstage/test-utils';
import { configure } from 'enzyme';
import { SelectScope } from '.';
import React from 'react';

describe('SelectScope test suite', () => {
  const mockClick = jest.fn();
  const Component = <SelectScope handleClick={mockClick} />;
  const ComponentWithDefault = <SelectScope handleClick={mockClick} defaultOption="repositories" />;

  beforeAll(() => {
    configure({ adapter: new Adapter() });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders to screen', async () => {
    await renderInTestApp(Component);
    expect(await screen.findByLabelText('scope select')).toBeVisible();
  });

  it('renders option scope available', async () => {
    // These scopes are defined as Teams, Topics, and Repositories

    const view = await renderInTestApp(Component);
    const Teams = screen.getByLabelText('teams');
    const Topics = screen.getByLabelText('topics');
    const Repos = screen.getByLabelText('repositories');
    expect(Teams).toBeVisible();
    expect(Topics).toBeVisible();
    expect(Repos).toBeVisible();
  });

  it('selects correct value if defaultOption is given', async () => {
    const view = await renderInTestApp(ComponentWithDefault);
    const Repos = screen.getByLabelText('repositories');
    const Teams = screen.getByLabelText('teams');
    expect(Repos).toHaveAttribute('aria-pressed', 'true');
    expect(Teams).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls handleClick prop when option is chosen', async () => {
    const view = await renderInTestApp(Component);

    const Topics = screen.getByLabelText('topics');
    await userEvent.click(Topics);
    const repos = screen.getByLabelText('repositories');
    await userEvent.click(repos);

    expect(mockClick).toHaveBeenCalledTimes(2);
  });
});
