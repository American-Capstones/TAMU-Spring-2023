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

export const Overview = () => (
  <Page themeId="tool">
    <Header title="Welcome to OVERVIEW!" subtitle="The Overview Page">
      <HeaderLabel label="Owner" value="Team X" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
      <ContentHeader title="Plugin title">
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
