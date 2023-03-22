import { useCallback, useEffect, useState } from "react";
import { getOctokit } from "../utils/functions";

import {
  useApi,
  githubAuthApiRef,
} from '@backstage/core-plugin-api';
import { getReposForTeam } from "../api/getReposForTeam";
import { Repository } from "../utils/types";

export function useGetReposFromTeam(orgName:string|undefined, teamName:string|undefined) {
    const [loading, setLoading] = useState<boolean>(true);
    const [repos, setRepos] = useState<Repository[]>([]);
    const [error, setError] = useState<Error>();

    const auth = useApi(githubAuthApiRef)

    const getOrgNames = useCallback(async () => {
        setLoading(true);
        try {
            if(teamName && orgName) {
                const graphql = await getOctokit(auth)
                const repoNames = await getReposForTeam(graphql, orgName, teamName)

                setRepos(repoNames)
            }
        }
        catch {
            setError(Error("Error in useGetReposFromTeam"))
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        getOrgNames();
    }, [getOrgNames]);

    return {
        loading, 
        repos,
        error
    };
}