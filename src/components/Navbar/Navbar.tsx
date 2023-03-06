import React from 'react';
import { Repo } from '../Repo';
import { TabbedLayout } from '@backstage/core-components';
import { DataView } from '../DataView';
import { Box } from '@material-ui/core';


export const Navbar = ({ }: {}) => {

  return (
    <TabbedLayout>
      <TabbedLayout.Route path="/" title="Overview">
        <>
          <h1>Overview</h1>
          <DataView />
        </>
      </TabbedLayout.Route>
      <TabbedLayout.Route path="/teams" title="Teams">
        <>
          <h1>Teams</h1>
          <DataView />
        </>
      </TabbedLayout.Route>
      <TabbedLayout.Route path="/repos" title="Repos">
        <Repo/>
      </TabbedLayout.Route>
    </TabbedLayout>
  );
};
