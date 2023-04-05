import React, { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
import { Route } from 'react-router-dom';
import {
  Header,
  Page,
  Content,
  HeaderLabel,
} from '@backstage/core-components';
import { FlatRoutes } from '@backstage/core-app-api';
import { OrgChoice, Organization, TeamPage, TopicPage, Repo } from '../Pages';
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
    teams: [],
    repos: [],
    topics: [],
    url: '',
    avatarUrl: '',
}
interface iDataContext {
    data: Org,
    setData: Dispatch<SetStateAction<Org>>
}
export const DataContext = createContext<iDataContext>({data:emptyOrg, setData:()=>{}});

export const Root = () => {
    const [data, setData] = useState(emptyOrg);
    const value = {data, setData};

    return (
        <Page themeId="tool">
            <Header title="Dependabot Dashboard" style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '1.64rem',
            }} >
                <Breadcrumbs />
            </Header>
            <Content>
                <div style={{
                    padding: '2.48rem'
                }}>
                    <DataContext.Provider value={value}>
                        <FlatRoutes>
                        <Route 
                            path='/'
                            element={<OrgChoice />}/>
                        <Route 
                            path='/:orgName'
                            element={<Organization />}/>
                        <Route 
                            path='/:orgName/team/:teamName'
                            element={<TeamPage />}/>
                        <Route 
                            path='/:orgName/team/:teamName/:repoName'
                            element={<Repo />}/>
                        <Route 
                            path='/:orgName/topic/:topicName'
                            element={<TopicPage />}/>
                        <Route 
                            path='/:orgName/topic/:topicName/:repoName'
                            element={<Repo />}/>
                        </FlatRoutes>
                    </DataContext.Provider>
                </div>
            </Content>
        </Page>
    )
};
