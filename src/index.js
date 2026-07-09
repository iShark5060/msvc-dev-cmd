import * as core from '@actions/core';

import { setupMSVCDevCmd } from './lib.js';

function run() {
  setupMSVCDevCmd(
    core.getInput('arch'),
    core.getInput('sdk'),
    core.getInput('toolset'),
    core.getInput('uwp'),
    core.getInput('spectre'),
    core.getInput('vsversion'),
  );
}

try {
  run();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  core.setFailed(`Could not setup Developer Command Prompt: ${message}`);
}
