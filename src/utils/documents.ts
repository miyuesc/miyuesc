export default {
  // @ts-ignore
  queryArchivesCount: ({ username, repository }) => `
    query { 
      repository(owner:"${username}", name: "${repository}") {
        issues(states:OPEN) {
          totalCount
        }
      }
    }
  `
};
