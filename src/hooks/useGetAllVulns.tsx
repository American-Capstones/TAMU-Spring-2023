import { useCallback, useEffect, useState } from "react";
import { getAllData } from "../api/getAllData";
import { formatOrgData, getOctokit } from "../utils/functions";

import {
  useApi,
  githubAuthApiRef,
} from '@backstage/core-plugin-api';
import { Org } from "../utils/types";

export function useGetAllVulns(orgName:string|undefined) {
    const [loading, setLoading] = useState<boolean>(true);
    const [orgData, setOrgData] = useState<Org>();
    const [error, setError] = useState<Error>();

    const auth = useApi(githubAuthApiRef)

    const getMonthVulns = useCallback(async () => {
        setLoading(true);
        if(orgName) {
            try {
                const graphql = await getOctokit(auth)
                const result = await getAllData(graphql, orgName) //result also has an error message that can be handled
                setOrgData(result)
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
        orgData,
        error
    };
}