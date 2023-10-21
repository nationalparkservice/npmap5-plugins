// rollup.config.js

import merge from 'deepmerge';
import terser from '@rollup/plugin-terser';
import { default as typescript } from 'rollup-plugin-typescript2';

import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('package.json'));
const env = process.env.NODE_ENV  || 'development';

const baseConfig = {
  input: './src/index.ts',
  output: {
    name: 'OverviewMap'
  },
  treeshake: env === 'production',
  plugins: [ typescript()]
};

const configs = [{
  environments: ['production'],
  output: {
    format: 'cjs',
    file: pkg.main,
  }
}, {
  environments: ['development', 'production'],
  output: {
    format: 'umd',
    file: pkg.browser,
    sourcemap: true
  },
  plugins: env === 'production' ? [terser()] : []
}, {
  environments: ['production'],
  output: {
    format: 'esm',
    file: pkg.module
  }
}]
  .filter(config => config.environments === undefined || config.environments.indexOf(env) > -1)
  .map(config => {delete config.environments; return config;})
  .map(config => merge(baseConfig, config));

console.log(configs);

export default configs;
