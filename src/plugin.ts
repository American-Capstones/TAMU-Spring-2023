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
      import('./components/Root').then(m => m.Root),
    mountPoint: rootRouteRef,
  }),
);
