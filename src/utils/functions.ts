import { Octokit } from '@octokit/rest';
import { OAuthApi } from '@backstage/core-plugin-api';
import { VulnInfoUnformatted, VulnInfoFormatted, RepoVulns, Org, RepositoryUnformatted, Repository, Coords } from "./types"

export const formatVulnData = (VulnDataUnformatted:VulnInfoUnformatted[]) => {
    const vdfArr : VulnInfoFormatted[] = []
    for (let vdu of VulnDataUnformatted) {
        let vulnVersionRange: string = ""; 
        if (vdu.securityVulnerability.firstPatchedVersion){
            vulnVersionRange = vdu.securityVulnerability.firstPatchedVersion.identifier
        }
        let vdf : VulnInfoFormatted = {
            "packageName": vdu.securityVulnerability.package.name,
            "versionNum": vdu.securityVulnerability.vulnerableVersionRange,
            "createdAt": vdu.createdAt, 
            "pullRequest": "",
            "dismissedAt": vdu.dismissedAt,
            "fixedAt": vdu.fixedAt,
            "vulnVersionRange": vulnVersionRange,
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
    let rv : any = {
        critical: critical,
        high: high,
        moderate: moderate,
        low: low,
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
        let topics : string[] = [];
        if (ru.repositoryTopics.edges.length != 0){
            for (let topicNode of ru.repositoryTopics.edges){
                topics.push(topicNode.node.topic.name);
                topics.push(", ");
            }
            topics.pop();
        }
        let rf : Repository = {
            id: ru.id,
            name: ru.name,
            low: 0,
            moderate: 0,
            high: 0,
            critical: 0,
            repositoryTopics: topics
        }
        RepositoryFormattedArr.push(rf);
    }
    return RepositoryFormattedArr;
}

export const getReposForOrg = (orgData:Org) => {
    let repoList:Repository[] = []
    let seen = new Set<string>
    for(let team of orgData.teams) {
        for(let repo of team.repos) {
            if(!seen.has(repo.id)) {
                repoList.push(repo)
            }
            seen.add(repo.id)
        }
    }
    return repoList
}

export const makeBarData = (orgData: any) => {
    return [
        {
            severity: "Low",
            count: orgData.vulnData.lowNum
        },
        {
            severity: "Moderate",
            count: orgData.vulnData.moderateNum
        },
        {
            severity: "High",
            count: orgData.vulnData.highNum
        },
        {
            severity: "Critical",
            count: orgData.vulnData.criticalNum
        },
    ];
}

export const makeLineData = (orgData: any) => {
    let crit_vulns:Coords[] = [];
    let high_vulns:Coords[] = [];
    let mod_vulns:Coords[] = [];
    let low_vulns:Coords[] = []; 
    let calendar = new Map();
    calendar.set(0, 'Jan');
    calendar.set(1, 'Feb');
    calendar.set(2, 'Mar');
    calendar.set(3, 'Apr');
    calendar.set(4, 'May');
    calendar.set(5, 'Jun');
    calendar.set(6, 'Jul');
    calendar.set(7, 'Aug');
    calendar.set(8, 'Sep');
    calendar.set(9, 'Oct');
    calendar.set(10, 'Nov');
    calendar.set(11, 'Dec');

    for (let m = 0; m < 12; m++) {
        let startMonth:number = orgData.vulnData.startMonth;
        let index:number = (m + startMonth) % 12;
        
        let x:string = calendar.get(index);
        let crit:number = orgData.vulnData.critical[index];
        let high:number = orgData.vulnData.high[index];
        let mod:number = orgData.vulnData.moderate[index];
        let low:number = orgData.vulnData.low[index];
        crit_vulns.push({x, y:crit});
        high_vulns.push({x, y:high});
        mod_vulns.push({x, y:mod});
        low_vulns.push({x, y:low});    
    }

    const return_val = [
        {
            id: "Critical",
            data: crit_vulns
        },
        {
            id: "High",
            data: high_vulns
        },
        {
            id: "Moderate",
            data: mod_vulns
        },
        {
            id: "Low",
            data: low_vulns
        }
    ]

    
    return return_val;
}