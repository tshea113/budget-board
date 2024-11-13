type ProjectEnvVariablesType = Pick<ImportMetaEnv, 'VITE_API_URL'>;

// Environment Variable Template to Be Replaced at Runtime
const projectEnvVariables: ProjectEnvVariablesType = {
  VITE_API_URL: '${VITE_API_URL}',
};

// Returning the variable value from runtime or obtained as a result of the build
export const getProjectEnvVariables = (): {
  envVariables: ProjectEnvVariablesType;
} => {
  return {
    envVariables: {
      VITE_API_URL: !projectEnvVariables.VITE_API_URL.includes('VITE_')
        ? projectEnvVariables.VITE_API_URL
        : import.meta.env.VITE_API_URL,
    },
  };
};
