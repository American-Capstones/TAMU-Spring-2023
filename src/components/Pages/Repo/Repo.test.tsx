import React from 'react';

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { Repo } from './Repo';
import { setupServer } from 'msw/node';
import { screen } from '@testing-library/react';
import {
  setupRequestMockHandlers,
  renderInTestApp,
} from "@backstage/test-utils";
import { configure, shallow } from 'enzyme';
import { FormControlLabel } from '@material-ui/core';
import { useGetVulnsFromRepo } from '../../../hooks/useGetVulnsFromRepo';

configure({adapter: new Adapter()});

const testRepo = 'TEST REPO';

// const test_vulnInfo: RepoVulns = 
jest.mock('../../../hooks/useGetVulnsFromRepo', () => ({
    ...jest.requireActual('../../../hooks/useGetVulnsFromRepo'),
    useGetVulnsFromRepo: jest.fn().mockReturnValue({ loading: false, vulns: { critical: [], high: [], moderate: [], low: [] } })
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn().mockReturnValue({ orgName: 'TEST ORG', teamName: 'TEST TEAM', repoName: 'TEST REPO' })
}));

describe('Repo Test Suite', () => {
    const server = setupServer();
    // Enable sane handlers for network requests
    setupRequestMockHandlers(server);

    it('should render title', async () => {
        await renderInTestApp(<Repo />);
        expect(useGetVulnsFromRepo).toHaveBeenCalled();
        expect(screen.getByText(testRepo)).toBeInTheDocument();
    });

    it('should render FormLabelControl component', async () => {
        const wrapper = shallow(<Repo />);
        expect(wrapper.find(FormControlLabel)).toHaveLength(1);
    });

    it('should render toggle component', async () => {
        await renderInTestApp(<Repo />);
        expect(screen.getByText('Open Only')).toBeInTheDocument();
    });

    it('should render critical list', async () => {
        await renderInTestApp(<Repo />);
        expect(screen.getByText('Critical', { exact: false })).toBeInTheDocument();
    });

    it('should render high list', async () => {
        await renderInTestApp(<Repo />);
        expect(screen.getByText('High', { exact: false })).toBeInTheDocument();
    });

    it('should render moderate list', async () => {
        await renderInTestApp(<Repo />);
        expect(screen.getByText('Moderate', { exact: false })).toBeInTheDocument();
    });

    it('should render low list', async () => {
        await renderInTestApp(<Repo />);
        expect(screen.getByText('Low', { exact: false })).toBeInTheDocument();
    });

    /*it('render NotFoundScreen when goes to a wrong path', async () => {
        history.replaceState({}, 'WrongPath', '/wrongpath');
        expect(wrapper.find(NotFoundScreen).length).toEqual(1);
    });*/
});
