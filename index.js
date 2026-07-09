import * as core from '@actions/core';

import { setupMSVCDevCmd } from './lib.js';

function main() {
  var arch = core.getInput('arch');
  const sdk = core.getInput('sdk');
  const toolset = core.getInput('toolset');
  const uwp = core.getInput('uwp');
  const spectre = core.getInput('spectre');
  const vsversion = core.getInput('vsversion');

  setupMSVCDevCmd(arch, sdk, toolset, uwp, spectre, vsversion);
}

try {
  main();
} catch (e) {
  core.setFailed('Could not setup Developer Command Prompt: ' + e.message);
}
