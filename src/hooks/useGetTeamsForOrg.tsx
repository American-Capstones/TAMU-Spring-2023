import { useCallback, useEffect, useState } from "react";
import { getOctokit } from "../utils/functions";

import {
  useApi,
  githubAuthApiRef,
} from '@backstage/core-plugin-api';
import { getTeamsForOrg } from "../api/getTeamsForOrg";
import { Team } from "../utils/types";

export function useGetTeamsForOrg(orgName:string) {
    const [loading, setLoading] = useState<boolean>(true);
    const [teams, setTeams] = useState<Team[]>([]);
    const auth = useApi(githubAuthApiRef)

    const getOrgNames = useCallback(async () => {
        setLoading(true);

        const graphql = await getOctokit(auth)
        const teamNames = await getTeamsForOrg(graphql, orgName)

        setTeams(teamNames)
        setLoading(false)
    }, [orgName])

    useEffect(() => {
        getOrgNames();
    }, [getOrgNames]);

    return {
        loading, 
        teams,
    };
}