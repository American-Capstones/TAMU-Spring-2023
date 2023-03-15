import { Breadcrumbs } from "./Breadcrumbs";
import { Breadcrumbs as BC } from "@material-ui/core";
import { screen } from "@testing-library/react";
import React from 'react';
import { shallow } from "enzyme";
import { renderInTestApp } from "@backstage/test-utils";

// This is my first component made completely via TDD.

const orgLoc  = { pathname: '/dd/testOrg' };
const teamLoc = { pathname: '/dd/testOrg/testTeam' };
const repoLoc = { pathname: '/dd/testOrg/testTeam/testRepo' };

jest.mock('react-router-dom');
const routerDom = require('react-router-dom');

describe('Breadcrumbs test suite', () => {
    it('should render the correct amount of breadcrumbs', async () => {
        jest.spyOn(routerDom, 'useLocation').mockImplementation(() => {
            return repoLoc
        });
        
        const wrapper = await renderInTestApp(<Breadcrumbs />);
        const numPaths = repoLoc.pathname.split('/').length;
        expect(wrapper.getAllByRole('link').length).toEqual(numPaths);
    });

    it('should render the correct name for each crumb', async () => {
        jest.spyOn(routerDom, 'useLocation').mockImplementation(() => repoLoc);
        
        const wrapper = await renderInTestApp(<Breadcrumbs />);
        const numPaths = repoLoc.pathname.split('/').length;
        const crumbs: HTMLAnchorElement[] = screen.getAllByRole('link');
        
        let path = '';
        crumbs.forEach((crumb) => {
            path += `/${crumb.textContent}`;
            console.log(crumb.textContent);
        })
        
        expect(path).toEqual(repoLoc.pathname);
    });

    it('should make each crumb link to the correct page', () => {

    });

    it('should make the last crumb unclickable', () => {

    });

    it('should not render a clickable crumb with only 1 path', () => {

    });

    it('should not render anything if path is root', () => {

    });
});
