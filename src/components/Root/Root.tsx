import React, { createContext, useContext, useState } from 'react';
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
export const DataContext = createContext({ data: emptyOrg, setData: (data: Org) => {} });

const setLanguage = (language) => {
    setState({...state, language: language})
  }

  const initState = {
    language: "en",
    setLanguage: setLanguage
  } 

  const [state, setState] = useState(initState)


export const Root = () => {
    const setData = (data: Org) => { setData({...state, data: data }) }
    const initState = {
        data: emptyOrg,
        setData: setData
    }
    const { data, setData } = useState(initState);

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
