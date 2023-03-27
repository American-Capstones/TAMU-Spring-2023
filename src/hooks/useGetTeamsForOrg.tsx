import { useCallback, useEffect, useState } from "react";
import { getOctokit } from "../utils/functions";

import {
  useApi,
  githubAuthApiRef,
} from '@backstage/core-plugin-api';
import { getTeamsForOrg } from "../api/getTeamsForOrg";
import { Team, VulnInfoUnformatted } from "../utils/types";
import {useGetSeverityCountsForOrg} from "./useGetSeverityCountsForOrg";
import { getVulnCountsForAllTeams } from "../api/getVulnCountsForAllTeams";

export function useGetTeamsForOrg(orgName:string | undefined) {
    const [loading, setLoading] = useState<boolean>(true);
    const [teams, setTeams] = useState<Team[]>([]);
    const [error, setError] = useState<Error>();

    const auth = useApi(githubAuthApiRef)

    const getOrgNames = useCallback(async () => {
        setLoading(true);
        
        let teamNames: Team[] = []
        const graphql = await getOctokit(auth)

        if (orgName) {
            try {
                teamNames = await getTeamsForOrg(graphql, orgName)
            }
            catch {
                setError(Error("Error in useGetTeamsForOrg"))
            }

            setTeams(teamNames)
        }

        teamNames = await getVulnCountsForAllTeams(graphql, teamNames, orgName);

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