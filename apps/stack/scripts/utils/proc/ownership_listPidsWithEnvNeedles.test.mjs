import test from 'node:test';
import assert from 'node:assert/strict';

import { parsePsPidCommandOutputForNeedles } from './ownership.mjs';

test('parsePsPidCommandOutputForNeedles requires all needles to match', () => {
  const output = [
    '101 node server.js HAPPIER_STACK_ENV_FILE=/tmp/a/env HAPPIER_STACK_PROCESS_KIND=infra',
    '102 node server.js HAPPIER_STACK_ENV_FILE=/tmp/a/env HAPPIER_STACK_PROCESS_KIND=session',
    '103 node server.js HAPPIER_STACK_ENV_FILE=/tmp/b/env HAPPIER_STACK_PROCESS_KIND=infra',
  ].join('\n');

  const pids = parsePsPidCommandOutputForNeedles(output, [
    'HAPPIER_STACK_ENV_FILE=/tmp/a/env',
    'HAPPIER_STACK_PROCESS_KIND=infra',
  ]);

  assert.deepEqual(pids, [101]);
});

test('parsePsPidCommandOutputForNeedles deduplicates matches and ignores invalid pid lines', () => {
  const output = [
    '201 cmd HAPPIER_STACK_ENV_FILE=/tmp/x/env HAPPIER_STACK_PROCESS_KIND=infra',
    'not-a-pid cmd HAPPIER_STACK_ENV_FILE=/tmp/x/env HAPPIER_STACK_PROCESS_KIND=infra',
    '201 cmd HAPPIER_STACK_ENV_FILE=/tmp/x/env HAPPIER_STACK_PROCESS_KIND=infra',
    '1 cmd HAPPIER_STACK_ENV_FILE=/tmp/x/env HAPPIER_STACK_PROCESS_KIND=infra',
  ].join('\n');

  const pids = parsePsPidCommandOutputForNeedles(output, [
    'HAPPIER_STACK_ENV_FILE=/tmp/x/env',
    'HAPPIER_STACK_PROCESS_KIND=infra',
  ]);

  assert.deepEqual(pids, [201]);
});

