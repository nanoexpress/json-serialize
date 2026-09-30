const benchmark = require('benchmark');
const SJS = require('slow-json-stringify');

const schema = {
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
};
const schemaCJS = {
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
};

const schemaSJS = {
  status: SJS.attr('string'),
  data: {
    user: { id: SJS.attr('string'), name: SJS.attr('string') }
  }
};

const arraySchema = {
  type: 'object',
  properties: {
    status: { type: 'string' },
    data: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: { id: { type: 'string' }, name: { type: 'string' } }
          }
        }
      }
    }
  }
};

const arraySchemaCJS = {
  type: 'object',
  properties: {
    status: { type: 'string' },
    data: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: { id: { type: 'string' }, name: { type: 'string' } }
          }
        }
      }
    }
  }
};

const arraySchemaSJS = {
  status: SJS.attr('string'),
  data: SJS.attr('array', {
    user: { id: SJS.attr('string'), name: SJS.attr('string') }
  })
};

const obj = {
  status: 'success',
  data: { user: { id: 'uuid', name: 'John' } }
};

const multiArray = {
  ...obj,
  data: new Array(10).fill(null).map(() => obj.data)
};

const CJS = require('compile-json-stringify');
const CJSStringify = CJS(schemaCJS);
const CJSStringifyArray = CJS(arraySchemaCJS);
const CJSStringifyString = CJS({ type: 'string' });

const SJSStringify = SJS.sjs(schemaSJS);
const SJSStringifyArray = SJS.sjs(arraySchemaSJS);
const SJSStringifyString = SJS.sjs(SJS.attr('string'));

const FJS = require('fast-json-stringify');
const stringify = FJS(schema);
const stringifyArray = FJS(arraySchema);
const stringifyString = FJS({ type: 'string' });
let str = '';

for (let i = 0; i < 10000; i++) {
  str += i;
  if (i % 100 === 0) {
    str += '"';
  }
}

function createSuite(type, fn) {
  console.log('Starting benchmark', type, '...', '\n');
  const suite = new benchmark.Suite();
  fn(suite);
  suite
    .on('cycle', (e) => console.log(e.target.toString()))
    .on('complete', function () {
      console.log(
        '\n',
        'Fastest is ' + this.filter('fastest').map('name'),
        '\n'
      );
    })
    .run();
  console.log('Done benchmark', type, '...', '\n');
}

createSuite('Object', (suite) => {
  suite.add('JSON.stringify obj', () => {
    JSON.stringify(obj);
  });

  suite.add('fast-json-stringify obj', () => {
    stringify(obj);
  });

  suite.add('compile-json-stringify obj', () => {
    CJSStringify(obj);
  });
  suite.add('slow-json-stringify obj', () => {
    SJSStringify(obj);
  });
});

createSuite('Array', (suite) => {
  suite.add('JSON.stringify array', () => {
    JSON.stringify(multiArray);
  });

  suite.add('fast-json-stringify array', () => {
    stringifyArray(multiArray);
  });

  suite.add('compile-json-stringify array', () => {
    CJSStringifyArray(multiArray);
  });
  suite.add('slow-json-stringify array', () => {
    SJSStringifyArray(multiArray);
  });
});

createSuite('Long string', (suite) => {
  suite.add('JSON.stringify long string', () => {
    JSON.stringify(str);
  });

  suite.add('fast-json-stringify long string', () => {
    stringifyString(str);
  });

  suite.add('compile-json-stringify long string', () => {
    CJSStringifyString(str);
  });

  suite.add('slow-json-stringify long string', () => {
    CJSStringifyString(str);
  });
});

createSuite('Short string', (suite) => {
  suite.add('JSON.stringify short string', () => {
    JSON.stringify('hello world');
  });

  suite.add('fast-json-stringify short string', () => {
    stringifyString('hello world');
  });

  suite.add('compile-json-stringify short string', () => {
    CJSStringifyString('hello world');
  });

  suite.add('slow-json-stringify short string', () => {
    SJSStringifyString('hello world');
  });
});
