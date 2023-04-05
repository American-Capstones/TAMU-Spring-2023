import { useCallback, useEffect, useState, useContext, Dispatch, SetStateAction } from "react";
import { getAllData } from "../api/getAllData";
import { formatOrgData, getOctokit } from "../utils/functions";
import { DataContext } from '../components/Root/Root';

import {
  useApi,
  githubAuthApiRef,
} from '@backstage/core-plugin-api';
import { Org } from "../utils/types";
import { ResponseError} from '@backstage/errors'

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
        if(orgName && data.name == "") {
            const graphql = await getOctokit(auth)

            const result = await getAllData(graphql, orgName) //result also has an error message that can be handled

            if (result.error){
                setError(Error(result.error));
            }

            try {
                setData(result)
            }
            catch {                
               setError(Error("Error in getAllData"))
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