import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, shallow } from 'enzyme';
import { VulnCard } from './VulnCard';
import React from 'react';
import { Typography } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { VulnInfoFormatted } from '../../utils/types';
import { format } from 'timeago.js';

// Test for <VulnCardBadge />
describe('VulnCardBadge Test Suite', () => {
  beforeAll(() => {
    configure({ adapter: new Adapter() });
  });

  const props: VulnInfoFormatted[] = [
    {
      packageName: 'Test Package',
      versionNum: '1.1.1',
      createdAt: '01/01/0001',
      pullRequest: 'NO',
      dismissedAt: '01/01/0001',
      fixedAt: '01/01/0001',
      vulnVersionRange: '1.0.0-1.1.0',
      classification: 'GENERAL',
      severity: 'critical',
      summary: 'test vulnerability',
      vulnerabilityCount: 1,
      state: 'OPEN',
      url: 'https://test.com',
    },
    {
      packageName: 'Test Package 2',
      versionNum: '2.2.2',
      createdAt: '02/02/0002',
      pullRequest: 'NO',
      dismissedAt: '02/02/0002',
      fixedAt: '02/02/0002',
      vulnVersionRange: '2.0.0-2.2.0',
      classification: 'GENERAL',
      severity: 'critical',
      summary: 'test vulnerability',
      vulnerabilityCount: 2,
      state: 'OPEN',
      url: 'https://test.com',
    },
  ];

  describe('VulnCard', () => {
    it('renders content', () => {
      const wrapper = shallow(<VulnCard vuln={props[0]} />);
      const result = wrapper.contains(<Typography variant="button">{props[0].packageName}</Typography>);
      expect(result).toBe(true);
    });

    it('converts UTC into human readable format', () => {
      const wrapper = shallow(<VulnCard vuln={props[0]} />);
      expect(
        wrapper.contains(
          <Typography style={{ fontWeight: 'normal', color: grey[600] }} variant="subtitle2">
            <span style={{ fontWeight: 'bolder' }}>{format(props[0].createdAt)}</span>
          </Typography>,
        ),
      ).toBe(true);
    });
  });
});
