import { doesNotThrow } from 'node:assert/strict';
import { describe, it } from 'node:test';
import avsc from 'avsc';
import compileJsonStringify from 'compile-json-stringify';
import fastJsonStringify from 'fast-json-stringify';
import { pack as msgpackR_Pack } from 'msgpackr';
import { attr, sjs } from 'slow-json-stringify';

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

describe('validate', () => {
  it('fast-json-stringify', () => doesNotThrow(() => fjs(data)));
  it('compile-json-stringify', () => doesNotThrow(() => cjs(data)));
  it('slow-json-stringify', () => doesNotThrow(() => sjsCompile(data)));
  it('avsc', () => doesNotThrow(() => AvroCompile.toString(data)));
  it('msgpackR', () => doesNotThrow(() => msgpackR_Pack(data).toString()));
});
