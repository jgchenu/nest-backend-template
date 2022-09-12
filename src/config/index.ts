/* eslint-disable @typescript-eslint/no-var-requires */

import * as _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';

import defaultConfig from './default';
const isProd = process.env.NODE_ENV == 'production';
const env = process.env.ENV || 'test';

let targetConfig = () => ({});

if (isProd) {
  targetConfig = require(path.resolve(__dirname, `./${env}.js`))['default'];
} else {
  const localConfigPath = path.resolve(__dirname, './local.js');
  if (fs.existsSync(localConfigPath)) {
    targetConfig = require(localConfigPath)['default'];
  }
}

export default () => _.merge({}, defaultConfig(), targetConfig());
