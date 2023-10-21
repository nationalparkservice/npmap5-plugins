// Importing necessary plugins and packages
import merge from 'deepmerge';
import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import alias from '@rollup/plugin-alias';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import fs from 'fs';

// Reading package name from package.json file
const name = JSON.parse(fs.readFileSync('package.json')).name;
// Reading environment variable or defaulting to 'development'
const env = process.env.NODE_ENV || 'development';

const kebabToPascal = (kebab) => {
	return kebab.replace(/(?:^|-)([a-z])/g, (match, char) => char.toUpperCase());
}

// Base Rollup configuration
const baseConfig = {
	input: './src/index.ts',
	output: {
		name: kebabToPascal(name)
	},
	treeshake: env === 'production',
	plugins: [
		typescript(),
		nodeResolve(),
		commonjs(),
		alias({ // Handlebars was trying to import fs without this code
			entries: [
				{
					find: 'handlebars',
					replacement: 'node_modules/handlebars/dist/handlebars.js'
				}
			]
		})
	]
};

// Rollup configurations for different environments
const configs = [
	{
		environments: ['development', 'production'],
		output: {
			format: 'umd',
			file: `./dist/${name}.js`,
		}
	},
	{
		environments: ['production'],
		output: {
			format: 'umd',
			file: `./dist/${name}.min.js`,
			sourcemap: true
		},
		plugins: [terser()]
	},
	{
		environments: ['production'],
		output: {
			format: 'esm',
			file: `./dist/${name}.esm.js`
		}
	}
]
	// Filtering out configurations that don't match the current environment
	.filter(
		config =>
			config.environments === undefined || config.environments.indexOf(env) > -1
	)
	// Removing the environments key from the configurations
	.map(config => {
		delete config.environments;
		return config;
	})
	// Merging baseConfig with each configuration
	.map(config => merge(baseConfig, config));

// Logging the resulting configurations to the console
console.log(configs);

// Exporting the resulting configurations
export default configs;
