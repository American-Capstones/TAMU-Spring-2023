import React from 'react';
import { Route } from 'react-router-dom';
// import { Typography, Grid } from '@material-ui/core';
import {
//   InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { FlatRoutes } from '@backstage/core-app-api';
import { OrgChoice, Organization, Team, Repo } from '../Pages';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';

export const Root = () => (
  <Page themeId="tool">
    <Header title="Welcome to Dependabot Dashboard!" >
      <HeaderLabel label="Owner" value="Never Spirit Airlines" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
      <div style={{
        margin: '30px'
      }}>
        <Breadcrumbs />
        <FlatRoutes>
          <Route 
            path='/'
            element={<OrgChoice />}/>
          <Route 
            path='/:orgName'
            element={<Organization />}/>
          <Route 
            path='/:orgName/:teamName'
            element={<Team />}/>
          <Route 
            path='/:orgName/:teamName/:repoName'
            element={<Repo />}/>
        </FlatRoutes>
      </div>
    </Content>
  </Page>
);
