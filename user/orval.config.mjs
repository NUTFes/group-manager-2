import { defineConfig } from 'orval';

export default defineConfig({
  groupManagerApi: {
    input: '/openapi/oas_doc.yml',
    output: {
      mode: 'tags-split',
      target: './src/api/generated/group-manager.ts',
      schemas: './src/api/generated/schemas',
      client: 'swr',
      httpClient: 'fetch',
      clean: true,
      prettier: true,
      baseUrl: {
        getBaseUrlFromSpecification: false,
        runtime: 'process.env.NEXT_PUBLIC_API_URL ?? ""',
      },
      override: {
        mutator: {
          path: './src/api/openapiFetcher.ts',
          name: 'openApiFetch',
        },
        swr: {
          swrOptions: {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            keepPreviousData: true,
            dedupingInterval: 10000,
          },
        },
      },
    },
  },
});
