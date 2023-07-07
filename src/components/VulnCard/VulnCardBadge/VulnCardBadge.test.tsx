import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, shallow } from 'enzyme';
import { VulnCardBadge } from './VulnCardBadge';
import React from 'react';
import { Tooltip } from '@material-ui/core';
import { SecurityOutlined, VerifiedUserOutlined } from '@material-ui/icons';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { severityColors } from '../../../utils/functions';

configure({ adapter: new Adapter() });

describe('VulnCardBadge Test Suite', () => {
  /* When there is no pull request, it return <></> */
  describe('When a valid state is given', () => {
    it("renders correct icon when state is 'open'", () => {
      const wrapper = shallow(<VulnCardBadge state={'OPEN'} severity="UNKNOWN" />);
      expect(wrapper.contains(<SecurityOutlined style={{ color: severityColors('UNKNOWN') }} />)).toBeTruthy();
    });

    it("renders correct icon when state is 'fixed'", () => {
      const wrapper = shallow(<VulnCardBadge state={'FIXED'} severity="critical" />);
      expect(wrapper.contains(<VerifiedUserOutlined style={{ color: severityColors('critical') }} />)).toBeTruthy();
    });

    it("renders correct icon when state is 'dismissed'", () => {
      const wrapper = shallow(<VulnCardBadge state={'DISMISSED'} severity="high" />);
      expect(wrapper.contains(<VerifiedUserIcon style={{ color: severityColors('high') }} />)).toBeTruthy();
    });

    it('renders correct icon when state is lowercase', () => {
      const wrapper = shallow(<VulnCardBadge state={'open'} severity="high" />);
      expect(wrapper.contains(<SecurityOutlined style={{ color: severityColors('high') }} />)).toBeTruthy();
    });

    it('renders correct icon when state is mixed case', () => {
      const wrapper = shallow(<VulnCardBadge state={'oPeN'} severity="critical" />);
      expect(wrapper.contains(<SecurityOutlined style={{ color: severityColors('critical') }} />)).toBeTruthy();
    });

    it('not render when there is no state', () => {
      const wrapper = shallow(<VulnCardBadge state="" severity="low" />);
      expect(wrapper.find(Tooltip)).toHaveLength(0);
    });
  });
});
