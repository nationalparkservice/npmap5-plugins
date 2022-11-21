// rollup.config.js

import merge from 'deepmerge';
import { terser } from "rollup-plugin-terser";
import { default as typescript } from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import webWorkerLoader from 'rollup-plugin-web-worker-loader';

import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('package.json'));
const env = process.env.NODE_ENV || 'development';

const baseConfig = {
  input: './src/index.ts',
  output: {
    name: pkg.exportName
  },
  treeshake: env === 'production',
  plugins: [typescript(), nodeResolve(), commonjs(), webWorkerLoader({
    'extensions': ['.ts']
  })]
};

const configs = [{
  environments: ['production'],
  output: {
    format: 'umd',
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
  .map(config => { delete config.environments; return config; })
  .map(config => merge(baseConfig, config));

console.log(configs);

export default configs;
