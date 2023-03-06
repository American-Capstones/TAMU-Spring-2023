import React from 'react';
import { Repo } from '../Pages/Repo';
import { Organization } from '../Pages/Organization';
import { TabbedLayout } from '@backstage/core-components';

// import 


export const Navbar = ({ }: {}) => {

  return (
    <TabbedLayout>
      <TabbedLayout.Route path="/" title="Overview">
        <Organization />
      </TabbedLayout.Route>
      <TabbedLayout.Route path="/teams" title="Teams">
        <>
          <h1>Teams</h1>
          {/* <DataView data={[]}/> */}
        </>
      </TabbedLayout.Route>
      <TabbedLayout.Route path="/repos" title="Repos">
        <Repo/>
      </TabbedLayout.Route>
    </TabbedLayout>
  );
};
