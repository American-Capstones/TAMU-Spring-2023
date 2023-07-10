import React from 'react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { Repo } from './Repo';
import { setupServer } from 'msw/node';
import { screen } from '@testing-library/react';
import { setupRequestMockHandlers, renderInTestApp } from '@backstage/test-utils';
import { configure, shallow } from 'enzyme';
import { FormControlLabel } from '@material-ui/core';
import { useGetVulnsFromRepo } from '../../../hooks/useGetVulnsFromRepo';

const testRepo = 'TEST REPO';

// const test_vulnInfo: RepoVulns =
jest.mock('../../../hooks/useGetVulnsFromRepo', () => ({
  ...jest.requireActual('../../../hooks/useGetVulnsFromRepo'),
  useGetVulnsFromRepo: jest
    .fn()
    .mockReturnValue({ loading: false, vulns: { critical: [], high: [], moderate: [], low: [] } }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ orgName: 'TEST ORG', teamName: 'TEST TEAM', repoName: 'TEST REPO' }),
  useNavigate: jest.fn(),
}));

describe('Repo Test Suite', () => {
  const server = setupServer();

  beforeAll(() => {
    configure({ adapter: new Adapter() });
  });

  it('renders title', async () => {
    await renderInTestApp(<Repo />);
    expect(useGetVulnsFromRepo).toHaveBeenCalled();
    expect(screen.getByText(testRepo)).toBeInTheDocument();
  });

  it('renders FormLabelControl component', async () => {
    const wrapper = shallow(<Repo />);
    expect(wrapper.find(FormControlLabel)).toHaveLength(1);
  });

  it('renders toggle component', async () => {
    await renderInTestApp(<Repo />);
    expect(screen.getByText('Open Alerts Only')).toBeInTheDocument();
  });

  it('renders critical list', async () => {
    await renderInTestApp(<Repo />);
    expect(screen.getByText('Critical', { exact: false })).toBeInTheDocument();
  });

  it('renders high list', async () => {
    await renderInTestApp(<Repo />);
    expect(screen.getByText('High', { exact: false })).toBeInTheDocument();
  });

  it('renders moderate list', async () => {
    await renderInTestApp(<Repo />);
    expect(screen.getByText('Moderate', { exact: false })).toBeInTheDocument();
  });

  it('renders low list', async () => {
    await renderInTestApp(<Repo />);
    expect(screen.getByText('Low', { exact: false })).toBeInTheDocument();
  });

  it.todo('routes to correct page on error');
});
