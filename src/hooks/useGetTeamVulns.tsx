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
interface iDataContext {
    data: Org,
    setData: Dispatch<SetStateAction<Org>>
}
export function useGetTeamVulns(orgName:string|undefined, teamName:string|undefined) {
    const { loading, data: orgData, error } = useGetAllVulns(orgName)
    // Filter now
    
    if (!orgData) {
        return {
            loading: true,
            data: orgData,
            error: "Error: Org not found"
        }
    }

    const teamData = orgData.teams.find(team => team.name == teamName)
    if (!teamData) {
        return {
            loading: false,
            data: orgData,
            error: "Error: Team not found"
        }
    }

    return {
        loading,
        data: teamData,
        error
    }
}