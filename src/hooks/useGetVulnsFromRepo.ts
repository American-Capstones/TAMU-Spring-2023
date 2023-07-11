import { useCallback, useEffect, useState } from 'react';
import { getVulnsFromRepo } from '../api/getVulnsFromRepo/getVulnsFromRepo';
import { getOctokit, sortVulnData } from '../utils/functions';

import { useApi, githubAuthApiRef } from '@backstage/core-plugin-api';
import { RepoVulns } from '../utils/types';

export function useGetVulnsFromRepo(repoName: string | undefined, orgName: string | undefined) {
  const [loading, setLoading] = useState<boolean>(true);
  const [vulnInfo, setVulnInfo] = useState<RepoVulns>();
  const [error, setError] = useState<Error>();

  const auth = useApi(githubAuthApiRef);

  const getVulns = useCallback(async () => {
    setLoading(true);
    try {
      if (repoName && orgName) {
        const graphql = await getOctokit(auth);
        const vulns = await getVulnsFromRepo(graphql, repoName, orgName);

        setVulnInfo(sortVulnData(vulns));
      }
    } catch {
      setError(Error('Error in useGetVulnsFromRepo'));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    getVulns();
  }, [getVulns]);

  return {
    loading,
    vulnInfo,
    error,
  };
}
