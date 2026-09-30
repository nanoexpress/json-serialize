import avsc from 'avsc';
import compileJsonStringify from 'compile-json-stringify';
import fastJsonStringify from 'fast-json-stringify';
import { pack as msgpackR_Pack } from 'msgpackr';
import { attr, sjs } from 'slow-json-stringify';
import { assert, describe, test } from 'vitest';

/**
 * DO NOT TOUCH
 * THIS IS TESTING CONSTANT
 */
/** @type {import('vitest').BenchOptions} */
const globalBenchConfig = {
  iterations: 10_000_000,
  warmupIterations: 1_000,
  now: process.now,
  throws: true
};

const fjs = fastJsonStringify({
  type: 'object',
  properties: {
    status: { type: 'string' },
    data: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: { id: { type: 'string' }, name: { type: 'string' } }
        }
      }
    }
  }
});
const cjs = compileJsonStringify({
  type: 'object',
  properties: {
    status: { type: 'string' },
    data: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: { id: { type: 'string' }, name: { type: 'string' } }
        }
      }
    }
  }
});
const sjsCompile = sjs({
  status: attr('string'),
  data: {
    user: { id: attr('string'), name: attr('string') }
  }
});
const AvroCompile = avsc.Type.forSchema({
  name: 'MyClass',
  type: 'record',
  namespace: 'com.acme.avro',
  fields: [
    {
      name: 'status',
      type: 'string'
    },
    {
      name: 'data',
      type: {
        name: 'data',
        type: 'record',
        fields: [
          {
            name: 'user',
            type: {
              name: 'user',
              type: 'record',
              fields: [
                {
                  name: 'id',
                  type: 'string'
                },
                {
                  name: 'name',
                  type: 'string'
                }
              ]
            }
          }
        ]
      }
    }
  ]
});

// Data
const data = {
  status: 'success',
  data: { user: { id: 'uuid', name: 'John' } }
};

describe('validate', () => {
  test('fast-json-stringify', () => assert.doesNotThrow(() => fjs(data)));
  test('compile-json-stringify', () => assert.doesNotThrow(() => cjs(data)));
  test('slow-json-stringify', () =>
    assert.doesNotThrow(() => sjsCompile(data)));
  test('avsc', () => assert.doesNotThrow(() => AvroCompile.toString(data)));
  test('msgpackR', () =>
    assert.doesNotThrow(() => msgpackR_Pack(data).toString()));
});

describe('serialize', () => {
  test('JSON.stringify', async ({ bench }) => {
    await bench('JSON.stringify', () => JSON.stringify(data)).run(
      globalBenchConfig
    );
  });
  test('fast-json-stringify', async ({ bench }) => {
    await bench('fast-json-stringify', () => fjs(data)).run(globalBenchConfig);
  });
  test('compile-json-stringify', async ({ bench }) => {
    await bench('compile-json-stringify', () => cjs(data)).run(
      globalBenchConfig
    );
  });
  test('slow-json-stringify', async ({ bench }) => {
    await bench('slow-json-stringify', () => sjsCompile(data)).run(
      globalBenchConfig
    );
  });
  test('avsc', async ({ bench }) => {
    await bench('avsc', () => AvroCompile.toString(data)).run(
      globalBenchConfig
    );
  });
  test('msgpackR', async ({ bench }) => {
    await bench('msgpackR', () => msgpackR_Pack(data).toString()).run(
      globalBenchConfig
    );
  });
});
