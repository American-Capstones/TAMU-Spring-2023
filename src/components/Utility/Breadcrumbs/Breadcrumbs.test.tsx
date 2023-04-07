import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { Breadcrumbs } from "./Breadcrumbs";
import { Typography } from "@material-ui/core";
import React from 'react';
import { configure, shallow } from 'enzyme';
import { Link } from "@backstage/core-components";

configure({ adapter: new Adapter() });

// When these paths are split, will result in an array like:
// [ "", "dd", "testOrg", ...]
// So the first two elements are always sliced out
const root = { pathname: '/dd' };
const one = { pathname: '/dd/testOrg' }
const loc = { pathname: '/dd/testOrg/team/testTeam/testRepo' };

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn().mockImplementation(() => loc)
}));
const routerDom = require('react-router-dom');

describe('Breadcrumbs test suite', () => {

    it('should render the correct amount of breadcrumbs', () => {
        const wrapper = shallow(<Breadcrumbs />);
        expect(wrapper.find(Link).length).toEqual(2);
        expect(wrapper.find(Typography).length).toEqual(1);
    });

    it('should render the correct name for each crumb', () => {
        const wrapper = shallow(<Breadcrumbs />);
        const pathname = loc.pathname;
        let crumbs = pathname.split('/').slice(2).filter((crumb) => !['team', 'topic', 'repo'].includes(crumb));
        const links = wrapper.find(Link);
        const current = wrapper.find(Typography);

        links.forEach((link) => {
            expect(crumbs.includes(link.text())).toBeTruthy();
            crumbs.splice(crumbs.indexOf(link.text()), 1);
        })

        expect(crumbs.length).toEqual(1); // The last crumb should be the current page, not a link
        expect(crumbs.includes(current.text())).toBeTruthy();
    });

    it('should make each crumb link to the correct page', async () => {
        // Find the link tags, test their "to" attr
        const wrapper = shallow(<Breadcrumbs />);
        const links = wrapper.find(Link);
        let aggregate = '';

        links.forEach(async (link) => {
            const page = link.text();
            const to = link.prop('to');

            if (page === "testTeam") {
                aggregate = `${aggregate}/team`
            }

            const expected = `${aggregate}/${page}`;
            expect(to).toEqual(`.${expected}`);
            aggregate = expected;
        });
    });

    it('should make the last crumb unclickable', () => {
        const wrapper = shallow(<Breadcrumbs />);
        const crumbs = loc.pathname.split('/').slice(2).filter((crumb) => !['team', 'topic', 'repo'].includes(crumb));
        const current = wrapper.find(Typography);
        console.log(crumbs, current.text())
        expect(current.text()).toEqual(crumbs.at(-1));
    });

    it('should not render a clickable crumb with only 1 path', () => {
        jest.spyOn(routerDom, 'useLocation').mockImplementation(() => one);

        const wrapper = shallow(<Breadcrumbs />);
        expect(wrapper.find(Link).length).toEqual(0);
    });

    it('should not render anything if path is root', () => {
        jest.spyOn(routerDom, 'useLocation').mockImplementation(() => root);

        const wrapper = shallow(<Breadcrumbs />);
        expect(wrapper.find(Link).length).toEqual(0);
        expect(wrapper.find(Typography).length).toEqual(0);
    });
});
