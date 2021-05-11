'use strict';

const benchmark = require('benchmark');
const SJS = require('slow-json-stringify');

const schema = {
  title: 'Example Schema',
  type: 'object',
  properties: {
    firstName: {
      type: 'string'
    },
    lastName: {
      type: ['string', 'null']
    },
    age: {
      description: 'Age in years',
      type: 'integer',
      minimum: 0
    }
  }
};
const schemaCJS = {
  title: 'Example Schema',
  type: 'object',
  properties: {
    firstName: {
      type: 'string'
    },
    lastName: {
      type: ['string', 'null']
    },
    age: {
      description: 'Age in years',
      type: 'number',
      minimum: 0
    }
  }
};

const schemaSJS = {
  firstName: SJS.attr('string'),
  lastName: SJS.attr('string'),
  age: SJS.attr('number')
};

const arraySchema = {
  title: 'array schema',
  type: 'array',
  items: schema
};

const arraySchemaCJS = {
  title: 'array schema',
  type: 'array',
  items: schemaCJS
};

const arraySchemaSJS = SJS.attr('array', SJS.sjs(schemaSJS));

const obj = {
  firstName: 'Matteo',
  lastName: 'Collina',
  age: 32
};

const multiArray = [obj, obj, obj, obj, obj];

const CJS = require('compile-json-stringify');
const CJSStringify = CJS(schemaCJS);
const CJSStringifyArray = CJS(arraySchemaCJS);
const CJSStringifyString = CJS({ type: 'string' });

const SJSStringify = SJS.sjs(schemaSJS);
const SJSStringifyArray = SJS.sjs(arraySchemaSJS);
const SJSStringifyString = SJS.sjs(SJS.attr('string'));

console.log('TEST [S-JS]', SJSStringify(obj));
console.log('TEST [S-JS] Array', SJSStringifyArray(multiArray));

const FJS = require('fast-json-stringify');
const stringify = FJS(schema);
const stringifyArray = FJS(arraySchema);
const stringifyString = FJS({ type: 'string' });
let str = '';

// eslint-disable-next-line
for (var i = 0; i < 10000; i++) {
  str += i;
  if (i % 100 === 0) {
    str += '"';
  }
}

Number(str);

for (i = 0; i < 1000 - 5; i++) {
  multiArray.push(obj);
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
  suite.add('JSON.stringify obj', function () {
    JSON.stringify(obj);
  });

  suite.add('fast-json-stringify obj', function () {
    stringify(obj);
  });

  suite.add('compile-json-stringify obj', function () {
    CJSStringify(obj);
  });
  suite.add('slow-json-stringify obj', function () {
    SJSStringify(obj);
  });
});

createSuite('Array', (suite) => {
  suite.add('JSON.stringify array', function () {
    JSON.stringify(multiArray);
  });

  suite.add('fast-json-stringify array', function () {
    stringifyArray(multiArray);
  });

  suite.add('compile-json-stringify array', function () {
    CJSStringifyArray(multiArray);
  });
  suite.add('slow-json-stringify array', function () {
    SJSStringifyArray(multiArray);
  });
});

createSuite('Long string', (suite) => {
  suite.add('JSON.stringify long string', function () {
    JSON.stringify(str);
  });

  suite.add('fast-json-stringify long string', function () {
    stringifyString(str);
  });

  suite.add('compile-json-stringify long string', function () {
    CJSStringifyString(str);
  });

  suite.add('slow-json-stringify long string', function () {
    CJSStringifyString(str);
  });
});

createSuite('Short string', (suite) => {
  suite.add('JSON.stringify short string', function () {
    JSON.stringify('hello world');
  });

  suite.add('fast-json-stringify short string', function () {
    stringifyString('hello world');
  });

  suite.add('compile-json-stringify short string', function () {
    CJSStringifyString('hello world');
  });

  suite.add('slow-json-stringify short string', function () {
    SJSStringifyString('hello world');
  });
});
