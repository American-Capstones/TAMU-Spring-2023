import { dependabotDashboardPlugin } from './plugin';

describe('dependabot-dashboard', () => {
  it('exports plugin', () => {
    expect(dependabotDashboardPlugin).toBeDefined();
  });
});
