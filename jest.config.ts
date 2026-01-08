import type { Config } from 'jest';
import { getJestProjectsAsync } from '@nx/jest';

export default async (): Promise<Config> => ({
  projects: [
    ...(await getJestProjectsAsync()),
    {
      displayName: 'api',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/**/*.test.js'],
      preset: 'ts-jest',
      transform: {
        '^.+\\.ts$': ['ts-jest', {
          useESM: false,
          tsconfig: {
            esModuleInterop: true,
            allowSyntheticDefaultImports: true,
          }
        }],
      },
      moduleFileExtensions: ['ts', 'js', 'json', 'node'],
      transformIgnorePatterns: ['node_modules/(?!(@angular)/)'],
    },
  ],
});
