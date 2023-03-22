import { useCallback, useEffect, useState } from "react";
import { getOrgsForUser } from "../api/getOrgsForUser";
import { formatOrgData, getOctokit } from "../utils/functions";

import {
  useApi,
  githubAuthApiRef,
} from '@backstage/core-plugin-api';
import { getReposForTeam } from "../api/getReposForTeam";
import { Repository } from "../utils/types";

export function useGetReposFromTeam(orgName:string, teamName:string|undefined) {
    const [loading, setLoading] = useState<boolean>(true);
    const [repos, setRepos] = useState<Repository[]>([]);
    const auth = useApi(githubAuthApiRef)

    const getOrgNames = useCallback(async () => {
        setLoading(true);
        if(teamName && orgName) {
            const graphql = await getOctokit(auth)
            const repoNames = await getReposForTeam(graphql, orgName, teamName)

            setRepos(repoNames)
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        getOrgNames();
    }, [getOrgNames]);

    return {
        loading, 
        repos,
    };
}