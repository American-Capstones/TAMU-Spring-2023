import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { Route } from 'react-router-dom';
import { configure, shallow } from 'enzyme';
import React from 'react';
import { Root } from './Root';
import { Header } from '@backstage/core-components';
import { OrgChoice, Organization, TeamPage, TopicPage, Repo } from '../Pages';

configure({adapter: new Adapter()});

type Props = {
    path: string,
    element: {
        type: () => {}
    }
}


let pathMap: Map<string, ()=>{}> = new Map<string, ()=>{}>;
describe('Root test suite', () => {
    beforeAll(() => {
        const component = shallow(<Root />);
        pathMap = component.find(Route).reduce((pathMap, route) => {
            const routeProps = route.props() as Props;
            return pathMap.set(routeProps.path, routeProps.element.type);
        }, pathMap);
    })
    
    it('should render a header for the plugin', () => {
        const wrapper = shallow(<Root />);
        expect(wrapper.find(Header).length).toEqual(1);
    })

    it('should show OrgChoice for "/" route', () => {
        expect(pathMap.get('/')).toBe(OrgChoice);
    })

    it('should show Org page for /:orgName route', () => {
        expect(pathMap.get('/:orgName')).toBe(Organization);
    })

    it('should show Team page for /:orgName/team/:teamName route', () => {
        expect(pathMap.get('/:orgName/team/:teamName')).toBe(TeamPage);
    })

    it('should show Repo page for /:orgName/:teamName/:repoName route', () => {
        expect(pathMap.get('/:orgName/team/:teamName/:repoName')).toBe(Repo);
    })

    it('should show Topic page for /:orgName/topic/:topicName route', () => {
        expect(pathMap.get('/:orgName/topic/:topicName')).toBe(TopicPage);
    })

    it('should show Repo page for /:orgName/topic/:topicName/:repoName route', () => {
        expect(pathMap.get('/:orgName/topic/:topicName/:repoName')).toBe(Repo);
    })
});