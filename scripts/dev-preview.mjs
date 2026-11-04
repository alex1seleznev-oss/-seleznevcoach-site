import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
// Accept the managed preview's Vite-style arguments without changing production.
const args = process.argv.slice(2).filter(value => value !== '--strictPort').map(value => value === '--host' ? '--hostname' : value);
const child = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'dev', '--webpack', ...args], { stdio: 'inherit', env: process.env });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', code => process.exit(code ?? 1));
