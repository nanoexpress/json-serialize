// Native benchmark runner (no test framework needed).
// Same measurement shape as before: warmup, then N timed iterations.
import { performance } from 'node:perf_hooks';
import avsc from 'avsc';
import compileJsonStringify from 'compile-json-stringify';
import fastJsonStringify from 'fast-json-stringify';
import { pack as msgpackR_Pack } from 'msgpackr';
import { attr, sjs } from 'slow-json-stringify';

/**
 * DO NOT TOUCH
 * THIS IS TESTING CONSTANT
 */
const ITERATIONS = 10_000_000;
const WARMUP_ITERATIONS = 1_000;

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

const data = {
  status: 'success',
  data: { user: { id: 'uuid', name: 'John' } }
};

const benches = {
  'JSON.stringify': () => JSON.stringify(data),
  'fast-json-stringify': () => fjs(data),
  'compile-json-stringify': () => cjs(data),
  'slow-json-stringify': () => sjsCompile(data),
  avsc: () => AvroCompile.toString(data),
  msgpackR: () => msgpackR_Pack(data).toString()
};

const results = [];
for (const [name, fn] of Object.entries(benches)) {
  for (let i = 0; i < WARMUP_ITERATIONS; i++) {
    fn();
  }
  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    fn();
  }
  const elapsed = performance.now() - start;
  results.push({ name, ops: (ITERATIONS / elapsed) * 1000 });
}

const fastest = Math.max(...results.map(({ ops }) => ops));
for (const { name, ops } of results) {
  const opsStr = ops.toLocaleString('en-US', { maximumFractionDigits: 2 });
  const relative = (ops / fastest).toFixed(2);
  console.log(`${name.padEnd(24)} ${opsStr.padStart(15)} ops/s  ${relative}x`);
}
