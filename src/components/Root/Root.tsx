import React, { createContext, useState } from 'react';
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

export const DataContext = createContext({ data: 'test', setData: (data: any) => {} });

export const Root = () => {
    const [data, setData] = useState<string>('test');

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
                <DataContext.Provider value={{ data, setData }}>
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
