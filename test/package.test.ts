import { execFileSync } from 'node:child_process'
import { cpSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { afterEach, describe, it } from 'vite-plus/test'

const packageRoot = resolve(import.meta.dirname, '..')
const fixtureSource = resolve(packageRoot, 'test/package')
const packageJson = JSON.parse(
  readFileSync(resolve(packageRoot, 'package.json'), 'utf8'),
) as { name: string, version: string }
const testDirectory = mkdtempSync(join(tmpdir(), 'instance-callable-'))
const fixtureRoot = resolve(testDirectory, 'package')
const tarball = resolve(
  testDirectory,
  `${packageJson.name}-${packageJson.version}.tgz`,
)

afterEach(() => {
  rmSync(testDirectory, { force: true, recursive: true })
})

describe('published package', () => {
  it('installs, type-checks, and runs as an external dependency', () => {
    cpSync(fixtureSource, fixtureRoot, { recursive: true })
    run('pnpm', ['pack', '--pack-destination', testDirectory], packageRoot)
    run('pnpm', ['add', '--ignore-workspace', tarball], fixtureRoot)
    run('pnpm', ['exec', 'tsc', '--project', 'tsconfig.json'], fixtureRoot)
    run('node', ['--experimental-strip-types', 'consumer.ts'], fixtureRoot)
  }, 30_000)
})

function run(command: string, argumentsList: string[], cwd: string) {
  return execFileSync(command, argumentsList, { cwd, encoding: 'utf8' })
}
