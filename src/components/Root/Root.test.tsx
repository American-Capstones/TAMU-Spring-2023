import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { Route } from 'react-router-dom';
import { configure, shallow } from 'enzyme';
import React from 'react';
import { Root } from './Root';
import { Header } from '@backstage/core-components';
import { OrgChoice, Organization, TeamPage, TopicPage, Repo } from '../Pages';

type Props = {
  path: string;
  element: {
    type: () => {};
  };
};

let pathMap: Map<string, () => {}>;
describe('Root test suite', () => {
  beforeAll(() => {
    configure({ adapter: new Adapter() });
    pathMap = new Map<string, () => {}>();

    const component = shallow(<Root />);
    pathMap = component.find(Route).reduce((pathMap, route) => {
      const routeProps = route.props() as Props;
      return pathMap.set(routeProps.path, routeProps.element.type);
    }, pathMap);
  });

  it('renders header for plugin', () => {
    const wrapper = shallow(<Root />);
    expect(wrapper.find(Header)).toHaveLength(1);
  });

  it('shows OrgChoice for "/" route', () => {
    expect(pathMap.get('/')).toBe(OrgChoice);
  });

  it('shows Org page for /:orgName route', () => {
    expect(pathMap.get('/:orgName')).toBe(Organization);
  });

  it('shows Team page for /:orgName/team/:teamName route', () => {
    expect(pathMap.get('/:orgName/team/:teamName')).toBe(TeamPage);
  });

  it('shows Repo page for /:orgName/:teamName/:repoName route', () => {
    expect(pathMap.get('/:orgName/team/:teamName/:repoName')).toBe(Repo);
  });

  it('shows Topic page for /:orgName/topic/:topicName route', () => {
    expect(pathMap.get('/:orgName/topic/:topicName')).toBe(TopicPage);
  });

  it('shows Repo page for /:orgName/topic/:topicName/:repoName route', () => {
    expect(pathMap.get('/:orgName/topic/:topicName/:repoName')).toBe(Repo);
  });

  it('shows Repo page for /:orgName/repo/:repoName route', () => {
    expect(pathMap.get('/:orgName/repo/:repoName')).toBe(Repo);
  });
});
