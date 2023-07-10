import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, shallow } from 'enzyme';
import { OrgChoice } from '.';
import React from 'react';
import { SelectOrg } from '../../Utility';

// This is necessary to mock useNavigate
// and to avoid issues with testing hooks

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
  useLocation: jest.fn().mockReturnValue({ pathname: '/dependabot-dashboard' }),
}));

jest.mock('../../../hooks/useGetOrgsForUser', () => ({
  ...jest.requireActual('../../../hooks/useGetOrgsForUser'),
  useGetOrgsForUser: jest.fn().mockReturnValue({ loading: false, orgs: ['test org', 'test org 2'] }),
}));

describe('OrgChoice test suite', () => {
  beforeAll(() => {
    configure({ adapter: new Adapter() });
  });

  it('shows OrgSelect element', () => {
    const wrapper = shallow(<OrgChoice />);
    expect(wrapper.contains(<SelectOrg />)).toBeTruthy();
  });
});
