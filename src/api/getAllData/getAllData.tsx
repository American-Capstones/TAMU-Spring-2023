import { getTeamsForOrg } from '../getTeamsForOrg/getTeamsForOrg';
import { getReposForTeam } from '../getReposForTeam/getReposForTeam';
import { getVulnsFromRepo } from '../getVulnsFromRepo/getVulnsFromRepo';
import { getReposForOrg } from '../getReposForOrg/getReposForOrg';

import { Team, Topic, Repository, vulnData, VulnInfoShort } from '../../utils/types';
import { formatVulnData } from '../../utils/functions';
import { EMPTY_ORG, EMPTY_TEAM, EMPTY_VULNDATA } from '../../utils/constants';

export const getAllData = (graphql: any, orgLogin: string) => {
  return getAllRawData(graphql, orgLogin);
};

export async function getAllRawData(graphql: any, orgLogin: string): Promise<{ orgData: any; error: string }> {
  let seen = new Set<string>();
  let seenTopics = new Map<string, Topic>();

  let orgData = JSON.parse(JSON.stringify(EMPTY_ORG));
  orgData.vulnData.startMonth = new Date().getMonth();
  orgData.name = orgLogin;

  // get all Repos in the org (in case a repo is not part of a team)
  // getReposForOrg throw an error
  let orgRepos: Repository[] = await getReposForOrg(graphql, orgLogin);
  let teamData: Team = JSON.parse(JSON.stringify(EMPTY_TEAM));

  let vulnDataResult = await getVulnDataForRepos(graphql, orgLogin, orgRepos, teamData, orgData, seen, seenTopics);
  orgData = vulnDataResult.orgData;
  seen = vulnDataResult.seen;
  seenTopics = vulnDataResult.seenTopics;

  // getTeamsForOrg return an error
  let teamNodes: Team[] = await getTeamsForOrg(graphql, orgLogin);
  for (let teamNode of teamNodes) {
    let teamData: Team = JSON.parse(JSON.stringify(EMPTY_TEAM));
    teamData.name = teamNode.name;

    teamData.vulnData.startMonth = new Date().getMonth();

    // getReposForTeam return an error
    let newRepos: Repository[] = await getReposForTeam(graphql, orgLogin, teamNode.name);

    let vulnDataResult = await getVulnDataForRepos(graphql, orgLogin, newRepos, teamData, orgData, seen, seenTopics);
    teamData = vulnDataResult.teamData;
    orgData = vulnDataResult.orgData;
    seen = vulnDataResult.seen;
    seenTopics = vulnDataResult.seenTopics;

    orgData.teams.push(teamData);
  }
  orgData.topics.push(...seenTopics.values());
  return orgData;
}

export async function getVulnDataForRepos(
  graphql: any,
  orgLogin: string,
  newRepos: Repository[],
  teamData: Team,
  orgData: any,
  seen: Set<string>,
  seenTopics: Map<string, Topic>,
): Promise<any> {
  for (let newRepo of newRepos) {
    let dismissed = new Set<VulnInfoShort>();

    //getVulnsFromRepo return an error
    let newVulns = await getVulnsFromRepo(graphql, newRepo.name, orgLogin);
    let newVulnsFormatted = formatVulnData(newVulns);

    newRepo['critical'] = 0;
    newRepo['high'] = 0;
    newRepo['moderate'] = 0;
    newRepo['low'] = 0;

    const repoJSON = JSON.parse(JSON.stringify(newRepo));
    const id = repoJSON.id;

    let topicVulnData: vulnData = JSON.parse(JSON.stringify(EMPTY_VULNDATA));

    for (let vuln of newVulnsFormatted) {
      let createdDate = new Date(vuln.createdAt);
      let createdIndex = createdDate.getMonth();
      let dismissedIndex = vuln.dismissedAt != null ? new Date(vuln.dismissedAt).getMonth() : -1;

      let today = new Date();
      const vulnJSON = JSON.parse(JSON.stringify(vuln));
      const vulnName = vulnJSON.packageName;
      const checkVuln: VulnInfoShort = {
        packageName: vulnName,
        versionNum: vulnJSON.versionNum,
        severity: vulnJSON.severity,
      };

      if (vuln.dismissedAt) {
        dismissed.add(checkVuln);
      } else if (dismissed.has(checkVuln)) {
        teamData.offenses.push(checkVuln);
      }

      let severityCat: string = '';
      let severityCatNum: string = '';

      if (vuln.severity == 'CRITICAL') {
        severityCat = 'critical';
        severityCatNum = 'criticalNum';
      } else if (vuln.severity == 'HIGH') {
        severityCat = 'high';
        severityCatNum = 'highNum';
      } else if (vuln.severity == 'MODERATE') {
        severityCat = 'moderate';
        severityCatNum = 'moderateNum';
      } else if (vuln.severity == 'LOW') {
        severityCat = 'low';
        severityCatNum = 'lowNum';
      }

      if (vuln.state == 'OPEN') {
        // @ts-ignore
        newRepo[severityCat] += 1;
        // @ts-ignore
        teamData.vulnData[severityCatNum] += 1;
      }

      let i = createdIndex;
      do {
        i %= 12;
        // @ts-ignore
        teamData.vulnData[severityCat][i] += 1;
        i += 1;
      } while (i != dismissedIndex && i != today.getMonth() + 1);

      if (!seen.has(id)) {
        if (vuln.state == 'OPEN') {
          // @ts-ignore
          orgData.vulnData[severityCatNum] += 1;
          // @ts-ignore
          topicVulnData[severityCatNum] += 1;
        }

        let i = createdIndex;
        do {
          i %= 12;
          if (
            today.getFullYear() - createdDate.getFullYear() == 0 ||
            (today.getFullYear() - createdDate.getFullYear() == 1 && createdDate.getMonth() - today.getMonth() > 0)
          ) {
            orgData.vulnData[severityCat][i] += 1;
          }
          // @ts-ignore
          topicVulnData[severityCat][i] += 1;
          i += 1;
        } while (i != dismissedIndex && i != today.getMonth() + 1);
      }
    }

    if (!seen.has(id)) {
      orgData.repos.push(newRepo);
    }

    if (!seen.has(id)) {
      for (let topic of newRepo.repositoryTopics) {
        if (topic != ', ' && seenTopics.has(topic)) {
          // We can assume that the get statements will always return a value, based on the if statement above.
          seenTopics.get(topic)!.vulnData.criticalNum += topicVulnData.criticalNum;
          seenTopics.get(topic)!.vulnData.highNum += topicVulnData.highNum;
          seenTopics.get(topic)!.vulnData.moderateNum += topicVulnData.moderateNum;
          seenTopics.get(topic)!.vulnData.lowNum += topicVulnData.lowNum;

          seenTopics.get(topic)!.vulnData.critical = seenTopics
            .get(topic)!
            .vulnData.critical.map((a, i) => a + topicVulnData.critical[i]);
          seenTopics.get(topic)!.vulnData.high = seenTopics
            .get(topic)!
            .vulnData.high.map((a, i) => a + topicVulnData.high[i]);
          seenTopics.get(topic)!.vulnData.moderate = seenTopics
            .get(topic)!
            .vulnData.moderate.map((a, i) => a + topicVulnData.moderate[i]);
          seenTopics.get(topic)!.vulnData.low = seenTopics
            .get(topic)!
            .vulnData.low.map((a, i) => a + topicVulnData.low[i]);

          seenTopics.get(topic)!.repos.push(newRepo);
        } else if (topic != ', ' && !seenTopics.has(topic)) {
          let newTopic: Topic = {
            name: topic,
            vulnData: {
              startMonth: new Date().getMonth(),
              critical: topicVulnData.critical,
              high: topicVulnData.high,
              moderate: topicVulnData.moderate,
              low: topicVulnData.low,
              criticalNum: topicVulnData.criticalNum,
              highNum: topicVulnData.highNum,
              moderateNum: topicVulnData.moderateNum,
              lowNum: topicVulnData.lowNum,
            },
            repos: [newRepo],
          };
          seenTopics.set(topic, newTopic);
        }
      }
    }
    seen.add(id);
    teamData.repos.push(newRepo);
  }

  return { teamData, orgData, seen, seenTopics };
}
