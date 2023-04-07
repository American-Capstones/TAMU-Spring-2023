import { useCallback, useEffect, useState } from "react";
import { getOctokit } from "../utils/functions";

import {
    useApi,
    githubAuthApiRef,
} from '@backstage/core-plugin-api';
import { getReposForTeam } from "../api/getReposForTeam";
import { Repository } from "../utils/types";
import { getVulnCountsForAllRepos } from "../api/getVulnCountsForAllRepos";


export function useGetReposFromTeam(orgName: string | undefined, teamName: string | undefined) {
    const [loading, setLoading] = useState<boolean>(true);
    const [repos, setRepos] = useState<Repository[]>([]);
    const [error, setError] = useState<Error>();

    const auth = useApi(githubAuthApiRef)

    const getOrgNames = useCallback(async () => {
        setLoading(true);
        let repoNames: Repository[] = []
        const graphql = await getOctokit(auth)

        try {
            if (teamName && orgName) {
                repoNames = await getReposForTeam(graphql, orgName, teamName)

            }
        }
        catch {
            setError(Error("Error in useGetReposFromTeam"))
        }

        setRepos(repoNames)

        repoNames = await getVulnCountsForAllRepos(graphql, repoNames, orgName);
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