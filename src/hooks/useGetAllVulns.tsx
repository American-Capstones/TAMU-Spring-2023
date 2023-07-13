import { useCallback, useEffect, useState, useContext, Dispatch, SetStateAction } from 'react';
import { getAllData } from '../api/getAllData/getAllData';
import { getOctokit } from '../utils/functions';
import { DataContext } from '../components/Root/Root';
import { useApi, githubAuthApiRef } from '@backstage/core-plugin-api';
import { Org } from '../utils/types';
import { EMPTY_ORG } from '../utils/constants';

interface iDataContext {
  data: Org;
  setData: Dispatch<SetStateAction<Org>>;
}

export function useGetAllVulns(orgName: string | undefined) {
  const [loading, setLoading] = useState<boolean>(true);
  const { data, setData } = useContext<iDataContext>(DataContext);
  const [error, setError] = useState<Error>();

  const auth = useApi(githubAuthApiRef);
  const getVulns = useCallback(async () => {
    if (orgName && data.name != orgName) {
      let allData: any;

      try {
        setLoading(true);
        const graphql = await getOctokit(auth);
        allData = await getAllData(graphql, orgName);

        setData(allData);
      } catch (caughtError: any) {
        setError(Error(caughtError.message));
        setLoading(true);
        setData(EMPTY_ORG);
      }
    }
    setLoading(false);
  }, [orgName]);

  useEffect(() => {
    getVulns();
  }, [getVulns]);

  return {
    setLoading,
    loading,
    data,
    error,
  };
}
