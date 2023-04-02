import { Octokit } from '@octokit/rest';
import { OAuthApi } from '@backstage/core-plugin-api';
import { VulnInfoUnformatted, VulnInfoFormatted, RepoVulns, Org, RepositoryUnformatted, Repository } from "./types"

export const formatVulnData = (VulnDataUnformatted:VulnInfoUnformatted[]) => {
    const vdfArr : VulnInfoFormatted[] = []
    for (let vdu of VulnDataUnformatted) {
        let vdf : VulnInfoFormatted = {
            "packageName": vdu.securityVulnerability.package.name,
            "versionNum": vdu.securityVulnerability.vulnerableVersionRange,
            "createdAt": vdu.createdAt, 
            "pullRequest": "",
            "dismissedAt": vdu.dismissedAt,
            "fixedAt": vdu.fixedAt,
            "vulnVersionRange": vdu.securityVulnerability.firstPatchedVersion.identifier,
            "classification": vdu.securityAdvisory.classification,
            "severity": vdu.securityAdvisory.severity,
            "summary": vdu.securityAdvisory.summary,
            "vulnerabilityCount": vdu.securityAdvisory.vulnerabilities.totalCount,
            "state": vdu.state, 
            "url": vdu.url
        }
        vdfArr.push(vdf)
    }
    return vdfArr
}

export const sortVulnData = (VulnDataUnformattedArr:VulnInfoUnformatted[]) => {
    const VulnDataFormattedArr = formatVulnData(VulnDataUnformattedArr)
    let critical : VulnInfoFormatted[] = []
    let high : VulnInfoFormatted[] = []
    let moderate : VulnInfoFormatted[] = []
    let low : VulnInfoFormatted[] = []
    for (let vd of VulnDataFormattedArr) {
        if(vd.severity.toLowerCase() == "critical"){
            critical.push(vd)
        }
        else if(vd.severity.toLowerCase() == "high"){
            high.push(vd)
        }
        else if(vd.severity.toLowerCase() == "moderate"){
            moderate.push(vd)
        }
        else if(vd.severity.toLowerCase() == "low"){
            low.push(vd)
        }
    }
    let rv : RepoVulns = {
        "critical": critical,
        "high": high,
        "moderate": moderate,
        "low": low,
    }
    return rv 
} 


export const countOpenVulnData = (VulnDataUnformattedArr:VulnInfoUnformatted[]) => {
    let critical : number = 0
    let high : number = 0
    let moderate : number = 0
    let low : number = 0
    for (let vdu of VulnDataUnformattedArr) {
        if(vdu.securityAdvisory.severity.toLowerCase() == "critical" && vdu.state == "OPEN"){
            critical += 1
        }
        else if(vdu.securityAdvisory.severity.toLowerCase() == "high"  && vdu.state == "OPEN"){
            high += 1
        }
        else if(vdu.securityAdvisory.severity.toLowerCase() == "moderate"  && vdu.state == "OPEN"){
            moderate += 1
        }
        else if(vdu.securityAdvisory.severity.toLowerCase() == "low"  && vdu.state == "OPEN"){
            low += 1
        }
    }
    let rv : RepoVulns = {
        "critical": critical,
        "high": high,
        "moderate": moderate,
        "low": low,
    }
    return rv 
} 


export const formatOrgData = (orgList:Org[]) => {
    let OrgNodes = orgList.map(a => a.name);
    return OrgNodes
}

export const getOctokit = async (auth:OAuthApi) => {
    const baseUrl = "https://api.github.com"
    const token = await auth.getAccessToken(['repo']);

    let octokit:Octokit = new Octokit({ auth: token, ...(baseUrl && { baseUrl }) });

    return octokit.graphql;
};

export const formatRepoNodes = (RepositoryUnformattedArr: RepositoryUnformatted[]) => {
    let RepositoryFormattedArr : Repository[] = []
    for (let ru of RepositoryUnformattedArr){
        let topics : String[] = [];
        if (ru.repositoryTopics.edges.length != 0){
            for (let topicNode of ru.repositoryTopics.edges){
                topics.push(topicNode.node.topic.name);
                topics.push(", ");
            }
            topics.pop();
        }
        let rf : Repository = {
            "id": ru.id,
            "name": ru.name, 
            "repositoryTopics": topics
        }
        RepositoryFormattedArr.push(rf);
    }
    return RepositoryFormattedArr;

export const getReposForOrg = (orgData:Org) => {
    let repoList:Repository[] = []
    let seen = new Set<string>
    for(let team of orgData.teams) {
        for(let repo of team.repos) {
            if(!seen.has(repo.ID)) {
                repoList.push(repo)
            }
            seen.add(repo.ID)
        }
    }
    return repoList
}