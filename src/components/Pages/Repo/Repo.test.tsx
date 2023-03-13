import React from 'react';

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { Repo } from './Repo';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { screen } from '@testing-library/react';
import {
  setupRequestMockHandlers,
  renderInTestApp,
} from "@backstage/test-utils";
import { configure, mount, shallow } from 'enzyme';
import { ErrorPage } from '@backstage/core-components';
import { FormControlLabel } from '@material-ui/core';

configure({adapter: new Adapter()});

describe('Repo', () => {
  const server = setupServer();
  // Enable sane handlers for network requests
  setupRequestMockHandlers(server);

  // setup mock response
  beforeEach(() => {
    server.use(
      rest.get('/*', (_, res, ctx) => res(ctx.status(200), ctx.json({}))),
    );
  });

  const RepoComponent = Repo;
  const wrapper = shallow(<Repo />)
  it('should render title', async () => {


    await renderInTestApp(RepoComponent);
    expect(screen.getByText('Repository Vulnerabilities')).toBeInTheDocument();
  });

  it('should render FormLabelControl component', async () => {
    await renderInTestApp(RepoComponent);
    expect(wrapper.find(FormControlLabel)).toHaveLength(1);
  });

  it('should render toggle component', async () => {
    await renderInTestApp(RepoComponent);
    expect(screen.getByText('Open Only')).toBeInTheDocument();
  });

  it('should render critical list', async () => {
    await renderInTestApp(RepoComponent);
    expect(screen.getByText('Critical')).toBeInTheDocument();
  });

  it('should render high list', async () => {
    await renderInTestApp(RepoComponent);
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('should render moderate list', async () => {
    await renderInTestApp(RepoComponent);
    expect(screen.getByText('Moderate')).toBeInTheDocument();
  });

  it('should render low list', async () => {
    await renderInTestApp(RepoComponent);
    expect(screen.getByText('Low')).toBeInTheDocument();
  });

  /*it('render NotFoundScreen when goes to a wrong path', async () => {
    history.replaceState({}, 'WrongPath', '/wrongpath');
    expect(wrapper.find(NotFoundScreen).length).toEqual(1);
  });*/

  
  
  
});
