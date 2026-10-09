import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { stripTypeScriptTypes } from 'node:module';
import assert from 'node:assert/strict';

const baseline = process.argv.includes('--baseline');
const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../encryption-visualizer');
const output = mkdtempSync(join(tmpdir(), 'cryptoviz-text-check-'));
const names = ['hash', 'hmac', 'padding', 'block-modes', 'rsa', 'signatures', 'cryptanalysis', 'password-hashing'];
for (const name of names) {
  const source = baseline
    ? execFileSync('git', ['show', `HEAD:encryption-visualizer/src/lib/crypto/${name}.ts`], { encoding: 'utf8', cwd: appRoot })
    : readFileSync(join(appRoot, `src/lib/crypto/${name}.ts`), 'utf8');
  const compiled = stripTypeScriptTypes(source).replace(/(from\s+['"]\.\/[^'"]+?)(?:\.js)?(['"])/g, '$1.mjs$2');
  writeFileSync(join(output, `${name}.mjs`), compiled);
}
const modules = {};
for (const name of names) modules[name] = await import(pathToFileURL(join(output, `${name}.mjs`)));
const checks = [];
const check = (name, test) => checks.push({ name, test });
const h = modules.hash;
for (const [input, expected] of [['', '811c9dc5'], ['a', 'e40c292c'], ['hello', '4f9f2cab'], ['foobar', 'bf9cf968']]) {
  check(`independent FNV-1a vector ${JSON.stringify(input)}`, () => assert.equal(h.simpleHash(input), expected));
}
check('emoji binary encodes all four UTF-8 bytes', () => assert.equal(h.stringToBinary('😀'), '11110000 10011111 10011000 10000000'));
const mac = modules.hmac;
check('independent toy byte-HMAC ASCII vector', () => assert.equal(mac.hmac('key', 'message'), '4fadf9db'));
check('independent toy byte-HMAC Unicode vector', () => assert.equal(mac.hmac('😀', 'é😀'), '28998039'));
check('distinct emoji keys stay distinct', () => assert.notEqual(mac.hmac('😀', 'message'), mac.hmac('😁', 'message')));
check('HMAC key normalization measures UTF-8 bytes', () => assert.equal(mac.hmacWithSteps('😀'.repeat(5), 'é😀')[1].values.action, 'Hashed then padded'));
const p = modules.padding;
for (const scheme of ['pkcs7', 'ansi-x923']) check(`${scheme} Unicode/control roundtrip`, () => {
  const result = p.padWithSteps('é😀\n', 8, scheme).at(-1);
  assert.equal(result.values.recoveredText, 'é😀\n');
  assert.equal(result.values.match, 'YES');
  assert.ok(p.compareSchemes('é😀\n', 8)[scheme].padded.every((byte) => byte >= 0 && byte <= 255));
});
check('aligned zero padding has no fabricated bytes', () => {
  const steps = p.padWithSteps('12345678', 8, 'zero');
  assert.equal(steps.find((step) => step.type === 'measure').values.paddingNeeded, 0);
  assert.deepEqual(steps.find((step) => step.type === 'calculate-padding').paddingBytes, []);
});
check('ANSI fill corruption is rejected', () => assert.throws(() => p.ansiX923Unpad([65, 9, 2])));
for (const size of [0, -1, 1.5, 256, NaN]) check(`invalid block size ${size}`, () => assert.throws(() => p.pad([65], size, 'pkcs7')));
check('out-of-range bytes rejected', () => assert.throws(() => p.pkcs7Pad([256], 8)));
const b = modules['block-modes'];
for (const name of ['encryptECBWithSteps', 'encryptCBCWithSteps', 'encryptGCMWithSteps']) {
  check(`${name} encodes Unicode as bytes`, () => {
    const steps = b[name]('😀é', 'clé');
    assert.equal(steps[0].values.plaintextHex, 'f09f9880c3a9');
    assert.ok(steps.at(-1).blocks.every((block) => /^[0-9a-f]+$/.test(block) && block.length <= 32));
  });
  check(`${name} caps visualization work`, () => assert.throws(() => b[name]('a'.repeat(1025), 'key')));
  check(`${name} rejects oversized UTF-8 key`, () => assert.throws(() => b[name]('text', '😀'.repeat(5))));
}
for (const input of ['', 'a', 'é😀', 'A'.repeat(16), 'A'.repeat(17)]) check(`GCM stream length ${JSON.stringify(input)}`, () => {
  assert.equal(b.encryptGCMWithSteps(input, 'key').at(-1).values.ciphertext.length, new TextEncoder().encode(input).length * 2);
});
check('toy tag includes changed suffix', () => assert.notEqual(b.encryptGCMWithSteps('same prefix text but A', 'key').at(-1).authTag, b.encryptGCMWithSteps('same prefix text but B', 'key').at(-1).authTag));
const s = modules.signatures;
const publicKey = { n: 3233, e: 17 };
for (const signature of [-1, 1.5, NaN, Infinity, 3233, Number.MAX_SAFE_INTEGER + 1]) check(`malformed signature ${signature}`, () => {
  assert.equal(s.verifySignature('message', signature, publicKey), false);
  assert.equal(s.verifySignatureWithSteps('message', signature, publicKey).isValid, false);
});
check('congruent out-of-range signature rejected', () => {
  const signature = s.signMessage('message', { n: 3233, d: 2753 });
  assert.equal(s.verifySignature('message', signature + 3233, publicKey), false);
});
for (const text of ['123junk', '12.5', '1e2', '-1', '3233']) check(`strict signature parse ${text}`, () => assert.equal(s.parseSignature(text, 3233), null));
for (const text of ['', '12345!', 'X']) check(`frequency analysis uncertainty ${JSON.stringify(text)}`, () => {
  const result = modules.cryptanalysis.frequencyAnalysisAttack(text).at(-1);
  assert.doesNotMatch(result.description, /successfully identified/);
  assert.equal(result.values['recovered key'], undefined);
});
let failed = 0;
for (const { name, test } of checks) {
  try { test(); console.log(`PASS ${name}`); }
  catch (error) { failed++; console.log(`FAIL ${name}: ${error.message}`); }
}
console.log(`${baseline ? 'BASELINE' : 'WORKING'}: ${checks.length - failed}/${checks.length} passed; ${failed} failed`);
process.exitCode = failed ? 1 : 0;
