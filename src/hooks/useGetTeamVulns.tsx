import { useCallback, useEffect, useState, useContext, Dispatch, SetStateAction } from "react";
import { getAllData } from "../api/getAllData";
import { formatOrgData, getOctokit } from "../utils/functions";
import { DataContext } from '../components/Root/Root';

import {
  useApi,
  githubAuthApiRef,
} from '@backstage/core-plugin-api';
import { Org } from "../utils/types";
import { useGetAllVulns } from "./useGetAllVulns";
import { EMPTY_ORG } from "../utils/constants";
interface iDataContext {
    data: Org,
    setData: Dispatch<SetStateAction<Org>>
}
export function useGetTeamVulns(orgName:string|undefined, teamName:string|undefined) {
    const { loading, data, error } = useGetAllVulns(orgName)
    // Filter now

   // console.log(`in tema vulns :${JSON.stringify(data)}`)
    
    if (!data) {
        return {
            loading: true,
            data: undefined,
            error: "Error: Org not found"
        }
    }

    const teamData = data.teams.find(team => team.name == teamName)
    if (!teamData) {
        return {
            loading: false,
            data: undefined,
            error: `Error: Team "${teamName}" not found`
        }
    }

    return {
        loading,
        data: teamData,
        error
    }
}