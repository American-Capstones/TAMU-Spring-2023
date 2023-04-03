import { useCallback, useEffect, useState, useContext, Dispatch, SetStateAction } from "react";
import { getAllData } from "../api/getAllData";
import { formatOrgData, getOctokit } from "../utils/functions";
import { DataContext } from '../components/Root/Root';

import {
  useApi,
  githubAuthApiRef,
} from '@backstage/core-plugin-api';
import { Org } from "../utils/types";
interface iDataContext {
    data: Org,
    setData: Dispatch<SetStateAction<Org>>
}
export function useGetAllVulns(orgName:string|undefined) {
    const [loading, setLoading] = useState<boolean>(true);
    const {data, setData} = useContext<iDataContext>(DataContext);
    const [error, setError] = useState<Error>();

    const auth = useApi(githubAuthApiRef)
    const getVulns = useCallback(async () => {
        setLoading(true);
        if(orgName && data.name != orgName) {
            console.log('GET ALL VULNS')
            try {
                const graphql = await getOctokit(auth)
                const result = await getAllData(graphql, orgName) //result also has an error message that can be handled
                setData(result)
            }
            catch {
                setError(Error("Error in useGetOrgsForUser"))
            }
        }
        setLoading(false)
    }, [orgName])

    useEffect(() => {
        getVulns();
    }, [getVulns]);

    return {
        loading, 
        data,
        error
    };
}