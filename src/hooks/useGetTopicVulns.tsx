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
export function useGetTopicVulns(orgName:string|undefined, topicName:string|undefined) {
    const { loading, data: orgData, error } = useGetAllVulns(orgName)
    
    if (!orgData) {
        return {
            loading: true,
            data: undefined,
            error: "Error: Org not found"
        }
    }

    // Filter org data for the topics

    const teamData = orgData.topics.find(topic => topic.name == topicName)
    if (!teamData) {
        return {
            loading: false,
            data: undefined,
            error: "Error: Team not found"
        }
    }

    return {
        loading,
        data: teamData,
        error
    }
}