const config = {
  api: {
    input: '../openapi/openapi.yaml',
    output: {
      target: 'src/lib/api/generated/index.ts',
      schemas: 'src/lib/api/generated/model',
      client: 'fetch',
    },
  },
};
export default config;
