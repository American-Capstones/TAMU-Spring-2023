import React from 'react';
import { Repo } from './Repo';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { screen } from '@testing-library/react';
import {
  setupRequestMockHandlers,
  renderInTestApp,
} from "@backstage/test-utils";

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


  it('should render', async () => {
    const RepoComponent = Repo;

    await renderInTestApp(RepoComponent);
    expect(screen.getByText('Repository Vulnerabilities')).toBeInTheDocument();
  });

  it('should render', async () => {
    const RepoComponent = Repo;

    await renderInTestApp(RepoComponent);
    expect(screen.getByText('Open Only')).toBeInTheDocument();
  });
  
});
