import { VulnInfoUnformatted, VulnInfoFormatted, RepoVulns } from "./types"

export const formatVulnData = (VulnDataUnformatted:VulnInfoUnformatted[]) => {
    const vdfArr : VulnInfoFormatted[] = []
    console.log("unformatted ", VulnDataUnformatted); 
    console.log(VulnDataUnformatted[0]);
    for (let vdu of VulnDataUnformatted) {
        console.log("inside loop");
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
            "state": vdu.state 
        }
        vdfArr.push(vdf)
    }
    return vdfArr
}

export const sortVulnData = (VulnDataUnformattedArr:VulnInfoUnformatted[]) => {
    console.log("allVulns inside sort", VulnDataUnformattedArr);
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