export const linking = {
  prefixes: ['vietflood://', 'https://vietflood.app'],
  config: {
    screens: {
      Login: 'auth/login',
      Register: 'auth/register',
      MainTabs: {
        screens: {
          Home: 'home',
          Reports: 'reports',
          Relief: 'relief/:operationId',
          Profile: 'profile',
        },
      },
      ReportDetail: 'reports/:reportId',
      OperationDetail: 'relief/operations/:operationId',
      NotFound: '*',
    },
  },
};
