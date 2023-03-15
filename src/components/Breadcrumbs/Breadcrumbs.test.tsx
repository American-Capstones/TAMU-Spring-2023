import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { Breadcrumbs } from "./Breadcrumbs";
import { Breadcrumbs as BC, Typography } from "@material-ui/core";
import { screen } from "@testing-library/react";
import React from 'react';
import { configure, render, shallow } from 'enzyme';
import { renderInTestApp } from "@backstage/test-utils";
import { Link } from "@backstage/core-components";

configure({adapter: new Adapter()});

// When these paths are split, will result in an array like:
// [ "", "dd", "testOrg", ...]
// So the first two elements are always sliced out
const root = { pathname: '/dd' };
const one = { pathname: '/dd/testOrg' }
const loc = { pathname: '/dd/testOrg/testTeam/testRepo' };

jest.mock('react-router-dom');
const routerDom = require('react-router-dom');

describe('Breadcrumbs test suite', () => {
    beforeEach(() => {
        jest.spyOn(routerDom, 'useLocation').mockImplementation(() => loc);
    })
    it('should render the correct amount of breadcrumbs', () => {
        const wrapper = shallow(<Breadcrumbs />);
        expect(wrapper.find(Link).length).toEqual(2);
        expect(wrapper.find(Typography).length).toEqual(1);
    });

    it('should render the correct name for each crumb', () => {
        const wrapper = shallow(<Breadcrumbs />);
        const crumbs = loc.pathname.split('/').slice(2);
        const links = wrapper.find(Link);
        const current = wrapper.find(Typography);
        
        links.forEach((link) => {
            expect(crumbs.includes(link.text())).toBeTruthy();
        })

        expect(crumbs.includes(current.text())).toBeTruthy();
    });

    it('should make each crumb link to the correct page', () => {
        // Find the link tags, test their "to" attr
        const wrapper = shallow(<Breadcrumbs />);
        const links = wrapper.find(Link);
        let aggregate = '';
        links.forEach((link) => {
            const page = link.text();
            const to = link.prop('to');
            const expected = `${aggregate}/${page}`;
            expect(to).toEqual(`.${expected}`);
            aggregate = expected;
        })
    });

    it('should make the last crumb unclickable', () => {
        const wrapper = shallow(<Breadcrumbs />);
        const crumbs = loc.pathname.split('/').slice(2);
        const current = wrapper.find(Typography);

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
