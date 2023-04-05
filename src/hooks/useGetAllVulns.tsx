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
        if(orgName && data.name != orgName) {
            let allData: any;
            try {
                const graphql = await getOctokit(auth)
                allData = await getAllData(graphql, orgName)

            }catch(caughtError){
                setError(Error(caughtError.message));
            }
            try {
                setData(allData)
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