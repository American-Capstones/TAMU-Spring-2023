
import { useCallback, useEffect, useState } from "react";
import { getMonthlyVulns } from "../api/getMonthlyVulns";
import { getOctokit } from "../utils/functions";

import {
    useApi,
    githubAuthApiRef,
} from '@backstage/core-plugin-api';

export function useGetMonthlyVulns(orgName: string | undefined) {
    const [loading, setLoading] = useState<boolean>(true);
    const [months, setMonths] = useState<number[]>([]);
    const [error, setError] = useState<Error>();

    const auth = useApi(githubAuthApiRef)

    const getMonthVulns = useCallback(async () => {
        setLoading(true);
        if (orgName) {
            try {
                const graphql = await getOctokit(auth)
                const result = await getMonthlyVulns(graphql, orgName) //result also has an error message that can be handled
                setMonths(result)
            }
            catch {
                setError(Error("Error in useGetOrgsForUser"))
            }
        }
        setLoading(false)
    }, [orgName])

    useEffect(() => {
        getMonthVulns();
    }, [getMonthVulns]);

    return {
        loading,
        months,
        error
    };
}