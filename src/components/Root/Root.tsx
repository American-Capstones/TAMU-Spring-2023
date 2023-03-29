import React, { createContext } from 'react';
import { Route } from 'react-router-dom';
import {
  Header,
  Page,
  Content,
  HeaderLabel,
} from '@backstage/core-components';
import { FlatRoutes } from '@backstage/core-app-api';
import { OrgChoice, Organization, Team, Repo } from '../Pages';
import { Breadcrumbs } from '../Utility';

const init = { data: 'test'}
export const DataContext = createContext(init);

export const Root = () => {


    return (
        <Page themeId="tool">
            <Header title="Welcome to Dependabot Dashboard!" >
                <HeaderLabel label="Owner" value="Never Spirit Airlines" />
                <HeaderLabel label="Lifecycle" value="Alpha" />
            </Header>
            <Content>
            <div style={{
                margin: '30px'
            }}>
                <DataContext.Provider value={init}>
                    <Breadcrumbs />
                    <FlatRoutes>
                    <Route 
                        path='/'
                        element={<OrgChoice />}/>
                    <Route 
                        path='/:orgName'
                        element={<Organization />}/>
                    <Route 
                        path='/:orgName/:teamName'
                        element={<Team />}/>
                    <Route 
                        path='/:orgName/:teamName/:repoName'
                        element={<Repo />}/>
                    </FlatRoutes>
                </DataContext.Provider>
            </div>
            </Content>
        </Page>
    )
};
