import { useGetAllVulns } from './useGetAllVulns';

export function useGetTeamVulns(orgName: string | undefined, teamName: string | undefined) {
  const { loading, data, error } = useGetAllVulns(orgName);
  // Filter now

  if (!data) {
    return {
      loading: true,
      data: undefined,
      error: 'Error: Org not found',
    };
  }

  const teamData = data.teams.find(team => team.name == teamName);
  if (!teamData) {
    return {
      loading: false,
      data: undefined,
      error: `Error: Team "${teamName}" not found`,
    };
  }

  return {
    loading,
    data: teamData,
    error,
  };
}
