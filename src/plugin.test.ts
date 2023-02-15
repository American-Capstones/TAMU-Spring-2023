import { dependabotDashboardPlugin } from './plugin';

describe('dependabot-dashboard', () => {
  it('should export plugin', () => {
    expect(dependabotDashboardPlugin).toBeDefined();
  });
});
