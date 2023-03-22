import { useCallback, useEffect, useState } from "react";
import { getOctokit } from "../utils/functions";

import {
  useApi,
  githubAuthApiRef,
} from '@backstage/core-plugin-api';
import { getTeamsForOrg } from "../api/getTeamsForOrg";
import { Team } from "../utils/types";

export function useGetTeamsForOrg(orgName:string | undefined) {
    const [loading, setLoading] = useState<boolean>(true);
    const [teams, setTeams] = useState<Team[]>([]);
    const [error, setError] = useState<Error>();
    
    const auth = useApi(githubAuthApiRef)

    const getOrgNames = useCallback(async () => {
        setLoading(true);

        if (orgName) {
            try {
                const graphql = await getOctokit(auth)
                const teamNames = await getTeamsForOrg(graphql, orgName)
                setTeams(teamNames)
            }
            catch {
                setError(Error("Error in useGetTeamsForOrg"))
            }
        }

        setLoading(false)
    }, [orgName])

    useEffect(() => {
        getOrgNames();
    }, [getOrgNames]);

    return {
        loading, 
        teams,
        error,
    };
}