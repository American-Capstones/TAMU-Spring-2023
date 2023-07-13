import React, { createContext, Dispatch, SetStateAction, useState } from 'react';
import { Route } from 'react-router-dom';
import { Header, Page, Content } from '@backstage/core-components';
import { FlatRoutes } from '@backstage/core-app-api';
import { OrgChoice, Organization, TeamPage, TopicPage, Repo } from '../Pages';
import { Breadcrumbs } from '../Utility';
import { Org } from '../../utils/types';
import { EMPTY_ORG } from '../../utils/constants';

interface iDataContext {
  data: Org;
  setData: Dispatch<SetStateAction<Org>>;
}
interface iTableContext {
  scope: string;
  setScope: Dispatch<SetStateAction<string>>;
}
export const DataContext = createContext<iDataContext>({ data: EMPTY_ORG, setData: () => {} });
export const ScopeContext = createContext<iTableContext>({ scope: 'teams', setScope: () => {} });

export const Root = () => {
  const [data, setData] = useState(EMPTY_ORG);
  const [scope, setScope] = useState('teams');
  const scopeValue = { scope, setScope };
  const value = { data, setData };

  return (
    <Page themeId="tool">
      <Header
        title="Dependabot Dashboard"
        style={{
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '1.64rem',
        }}
      >
        <Breadcrumbs />
      </Header>
      <Content>
        <div
          style={{
            padding: '2.48rem',
          }}
        >
          <DataContext.Provider value={value}>
            <ScopeContext.Provider value={scopeValue}>
              <FlatRoutes>
                <Route path="/" element={<OrgChoice />} />
                <Route path="/:orgName" element={<Organization />} />
                <Route path="/:orgName/team/:teamName" element={<TeamPage />} />
                <Route path="/:orgName/team/:teamName/:repoName" element={<Repo />} />
                <Route path="/:orgName/topic/:topicName" element={<TopicPage />} />
                <Route path="/:orgName/topic/:topicName/:repoName" element={<Repo />} />
                <Route path="/:orgName/repo/:repoName" element={<Repo />} />
              </FlatRoutes>
            </ScopeContext.Provider>
          </DataContext.Provider>
        </div>
      </Content>
    </Page>
  );
};
