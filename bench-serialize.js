const fastJsonStringify = require('fast-json-stringify');
const { sjs, attr } = require('slow-json-stringify');
const msgpackR = require('msgpackr');
const avsc = require('avsc');

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

console.log('test - f-js', fjs(data));
console.log('test - s-js', sjsCompile(data));
console.log('test - avsc', AvroCompile.toString(data));
console.log('test - mgsp', msgpackR.pack(data).toString());

const table = [];

const bench = (name, fn) => {
  const startTime = Date.now();
  for (let i = 0; i < 4e5; i++) {
    fn();
  }
  table.push({ name, 'time taken': Date.now() - startTime + 'ms' });
};

const run = () =>
  new Promise((resolve) => {
    bench('JSON.stringify', () => JSON.stringify(data));
    bench('fast-json-stringify', () => fjs(data));
    bench('slow-json-stringify', () => sjsCompile(data));
    bench('avsc', () => AvroCompile.toString(data));
    bench('msgpackR', () => msgpackR.pack(data).toString());

    resolve();
  });

async function main() {
  console.log('Benchmark started...');
  await run();
  console.log('Benchmark done');

  console.table(table);
}

main();
