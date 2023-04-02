import React from 'react';
import { Route } from 'react-router-dom';
import {
  Header,
  Page,
  Content,
  HeaderLabel,
} from '@backstage/core-components';
import { FlatRoutes } from '@backstage/core-app-api';
import { OrgChoice, Organization, Team, Repo } from '../Pages';
import { Breadcrumbs } from '../Utility';

export const Root = () => (
  <Page themeId="tool">
    <Header title="Dependabot Dashboard" style={{
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '1.64rem',
    }} >
      <Breadcrumbs />
    </Header>
    <Content>
      <div style={{
        padding: '2.48rem'
      }}>
        <FlatRoutes>
          <Route
            path='/'
            element={<OrgChoice />} />
          <Route
            path='/:orgName'
            element={<Organization />} />
          <Route
            path='/:orgName/:teamName'
            element={<Team />} />
          <Route
            path='/:orgName/:teamName/:repoName'
            element={<Repo />} />
        </FlatRoutes>
      </div>
    </Content>
  </Page>
);
