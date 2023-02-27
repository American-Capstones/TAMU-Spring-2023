import React from 'react';
import { Route } from 'react-router-dom';
import {
  TabbedLayout, 
} from '@backstage/core-components';
import { Repo } from '../Repo';
import { FlatRoutes } from '@backstage/core-app-api';



export const Navbar = ({  }: { }) => {

  return (
    <TabbedLayout>
      <TabbedLayout.Route path="/" title="Overview">
        <h1>Overview</h1>
      </TabbedLayout.Route>
      <TabbedLayout.Route path="/teams" title="Teams">
        <h1>Teams</h1>
      </TabbedLayout.Route>
      <TabbedLayout.Route path="/repos" title="Repos">
        <Repo/>
      </TabbedLayout.Route>
    </TabbedLayout>
  );
};