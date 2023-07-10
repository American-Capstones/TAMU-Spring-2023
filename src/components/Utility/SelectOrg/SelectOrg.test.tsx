import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderInTestApp } from '@backstage/test-utils';
import { configure } from 'enzyme';
import { SelectOrg } from '.';
import React from 'react';

const testOrg = {
  name: 'test org 2',
  avatarUrl: 'test avatar url',
  url: 'test url',
};

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock('../../../hooks/useGetOrgsForUser', () => ({
  ...jest.requireActual('../../../hooks/useGetOrgsForUser'),
  useGetOrgsForUser: jest.fn().mockReturnValue({
    loading: false,
    orgs: [
      {
        name: 'test org',
        url: 'test url 1',
        avatarUrl: 'test url 1',
      },
      {
        name: 'test org 2',
        url: 'test url 2',
        avatarUrl: 'test url 2',
      },
    ],
  }),
}));

describe('SelectOrg test suite', () => {
  beforeAll(() => {
    configure({ adapter: new Adapter() });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders on screen', async () => {
    await renderInTestApp(<SelectOrg />);
    expect(await screen.findByLabelText('Organization')).toBeVisible();
  });

  it('renders option per org found', async () => {
    const view = await renderInTestApp(<SelectOrg />);
    const Select = screen.getByRole('button');
    await userEvent.click(Select);
    const Options = screen.getAllByRole('option');

    // orgs length
    expect(Options).toHaveLength(2);
  });

  it('selects correct value if defaultOption is given', async () => {
    const view = await renderInTestApp(<SelectOrg defaultOption="test org 2" />);
    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('value', 'test org 2');
  });

  it('redirects to org page if value is selected', async () => {
    const view = await renderInTestApp(<SelectOrg />);
    const autocomplete = screen.getByTestId('autocomplete');
    const input = screen.getByRole('combobox');
    await userEvent.click(input);
    autocomplete.focus();

    await userEvent.type(autocomplete, '{arrowdown}');
    await userEvent.type(autocomplete, '{enter}');
    expect(mockedUsedNavigate).toHaveBeenCalledWith(`../test org 2`, { replace: true });
  });

  // an undefined value just means the user clicked away from it
  it('does not redirect if select value is undefined', async () => {
    const view = await renderInTestApp(<SelectOrg />);
    const Select = screen.getByRole('button');
    await userEvent.click(Select);
    await userEvent.click(document.body);
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });
});
