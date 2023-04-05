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
import { EMPTY_ORG } from "../utils/constants";

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

        if(orgName && data.name != orgName) {
            let allData: any;

            try {
                const graphql = await getOctokit(auth)
                allData = await getAllData(graphql, orgName)

                setData(allData)
            }catch(caughtError){
                setError(Error(caughtError.message));
                setData(EMPTY_ORG)
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