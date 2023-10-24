import { mkdir, readFile, writeFile } from 'fs/promises';
import { sync } from 'glob';
import { join, resolve, basename } from 'path';
import { optimize } from 'svgo';
import { parseStringPromise } from 'xml2js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { existsSync } from 'fs';
import SvgInfo from './types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const defaultInputPath = join(__dirname, 'src');

/**
 * Generates a list of SVG information by reading SVG files from the provided directory.
 *
 * @param {string} inputPath - The directory path where SVG files are located. Defaults to './src'.
 * @returns {Promise<SvgInfo[]>} - A promise that resolves to an array of SVG information.
 */
export async function generateList(inputPath: string = defaultInputPath): Promise<typeof SvgInfo> {
  const paths = sync(resolve(join(inputPath, '*.svg')));

  const tasks = paths.map(async (file) => {
    const imgSvg = await readFile(file);
    const svgXml = imgSvg.toString('utf8');

    const contentsPromise = parseStringPromise(svgXml);
    const optimized = optimize(svgXml, {
      multipass: true,
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false,
            },
          },
        },
      ]
    });

    const widthMatch = optimized.data.match(/ width="([^"]+)"/);
    const heightMatch = optimized.data.match(/ height="([^"]+)"/);
    let width = 0, height = 0;
    if (widthMatch) width = parseFloat(widthMatch[1].replace('px', ''));
    if (heightMatch) height = parseFloat(heightMatch[1].replace('px', ''));

    const contents = await contentsPromise;
    const name = (contents.svg.title ? contents.svg.title[0] : basename(file)).replace(/.svg$/, '');

    const svg: (typeof SvgInfo)[0] = {
      icon: name.replace(/(-\d+)$/, ''),
      data: optimized.data,
      width,
      height
    };

    return svg;
  });

  return Promise.all(tasks);
}

generateList('./src').then(async result => {
  // Convert the result object to a JSON string
  const json = JSON.stringify(result);

  // Define the output directory and file
  const outputDir = join(__dirname, '../dist');
  const outputFile = join(outputDir, 'index.json'); //TODO read this from the package?

  // If the output directory doesn't exist, create it
  if (!existsSync(outputDir)) {
    await mkdir(outputDir);
  }

  // Write the JSON string to the specified output file
  await writeFile(outputFile, json, 'utf-8');
}).catch((error) => console.error(error));
