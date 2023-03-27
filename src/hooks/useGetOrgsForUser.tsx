import { useCallback, useEffect, useState } from "react";
import { getOrgsForUser } from "../api/getOrgsForUser";
import { formatOrgData, getOctokit } from "../utils/functions";

import {
  useApi,
  githubAuthApiRef,
} from '@backstage/core-plugin-api';

export function useGetOrgsForUser() {
    const [loading, setLoading] = useState<boolean>(true);
    const [orgs, setOrgs] = useState<string[]>([]);
    const [error, setError] = useState<Error>();

    const auth = useApi(githubAuthApiRef)

    const getOrgNames = useCallback(async () => {
        setLoading(true);
        try {
            const graphql = await getOctokit(auth)
            const result = await getOrgsForUser(graphql) //result also has an error message that can be handled
            const orgNamesFormatted = formatOrgData(result.orgNodes)
            setOrgs(orgNamesFormatted)
        }
        catch {
            setError(Error("Error in useGetOrgsForUser"))
        }

        setLoading(false)
    }, [])

    useEffect(() => {
        getOrgNames();
    }, [getOrgNames]);

    return {
        loading, 
        orgs,
        error
    };
}