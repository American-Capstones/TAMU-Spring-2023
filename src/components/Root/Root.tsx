import React, { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
import { Route } from 'react-router-dom';
import {
  Header,
  Page,
  Content,
  HeaderLabel,
} from '@backstage/core-components';
import { FlatRoutes } from '@backstage/core-app-api';
import { OrgChoice, Organization, TeamPage, Repo } from '../Pages';
import { Breadcrumbs } from '../Utility';
import { Org } from '../../utils/types';

const emptyOrg:Org = {
    name: '',
    vulnData: {
        startMonth: undefined,
        critical: [],
        high: [],
        moderate: [],
        low: [],
        criticalNum: 0,
        highNum: 0,
        moderateNum: 0,
        lowNum: 0,
    },
    teams: []
}
interface iDataContext {
    data: Org,
    setData: Dispatch<SetStateAction<Org>>
}
export const DataContext = createContext<iDataContext>({data:emptyOrg, setData:()=>{}});

export const Root = () => {
    const [data, setData] = useState(emptyOrg);
    const value = {data, setData}
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
                <DataContext.Provider value={value}>
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
                        element={<TeamPage />}/>
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
