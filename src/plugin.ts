import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const dependabotDashboardPlugin = createPlugin({
  id: 'dependabot-dashboard',
  routes: {
    root: rootRouteRef,
  },
});

export const DependabotDashboardPage = dependabotDashboardPlugin.provide(
  createRoutableExtension({
    name: 'DependabotDashboardPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
