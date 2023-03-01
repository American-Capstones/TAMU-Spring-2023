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
import { Navbar } from '../Navbar';

export const Root = () => (
  <Page themeId="tool">
    <Header title="Welcome to Dependabot Dashboard!" >
      <HeaderLabel label="Owner" value="Team X" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
      <ContentHeader title="Dependabot Dashboard">
        <SupportButton>A description of your plugin goes here.</SupportButton>
      </ContentHeader>
      <FlatRoutes>
        <Route 
          path='/*'
          element={<Navbar />}/>
      </FlatRoutes>
    </Content>
  </Page>
);
