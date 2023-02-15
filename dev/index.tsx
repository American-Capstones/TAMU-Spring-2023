import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { dependabotDashboardPlugin, DependabotDashboardPage } from '../src/plugin';

createDevApp()
  .registerPlugin(dependabotDashboardPlugin)
  .addPage({
    element: <DependabotDashboardPage />,
    title: 'Root Page',
    path: '/dependabot-dashboard'
  })
  .render();
