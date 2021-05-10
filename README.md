# json-serialize

## Installation

```bash
yarn
```

## How to Run

```bash
yarn bench
```

## Results

This result on Macbook Pro M1

```bash
❯ yarn bench
yarn run v1.22.10
$ node bench-serialize.js
test - f-js {"status":"success","data":{"user":{"id":"uuid","name":"John"}}}
test - c-js {"status":"success","data":{"user":{"id":"uuid","name":"John"}}}
test - s-js {"status":"success","data":{"user":{"id":"uuid","name":"John"}}}
test - avsc {"status":"success","data":{"user":{"id":"uuid","name":"John"}}}
test - mgsp ��status�success�data��user��id�uuid�name�John
Benchmark started...
Benchmark done
┌─────────┬──────────────────────────┬────────────┐
│ (index) │           name           │ time taken │
├─────────┼──────────────────────────┼────────────┤
│    0    │     'JSON.stringify'     │  '352ms'   │
│    1    │  'fast-json-stringify'   │   '79ms'   │
│    2    │ 'compile-json-stringify' │   '44ms'   │
│    3    │  'slow-json-stringify'   │   '33ms'   │
│    4    │          'avsc'          │  '520ms'   │
│    5    │        'msgpackR'        │  '316ms'   │
└─────────┴──────────────────────────┴────────────┘
✨  Done in 1.64s.
```

## License

MIT
