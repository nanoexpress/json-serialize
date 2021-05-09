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
test - s-js {"status":"success","data":{"user":{"id":"uuid","name":"John"}}}
test - avsc {"status":"success","data":{"user":{"id":"uuid","name":"John"}}}
test - mgsp ��status�success�data��user��id�uuid�name�John
Benchmark started...
Benchmark done
┌─────────┬───────────────────────┬────────────┐
│ (index) │         name          │ time taken │
├─────────┼───────────────────────┼────────────┤
│    0    │   'JSON.stringify'    │  '182ms'   │
│    1    │ 'fast-json-stringify' │  '109ms'   │
│    2    │ 'slow-json-stringify' │   '58ms'   │
│    3    │        'avsc'         │  '331ms'   │
│    4    │      'msgpackR'       │  '208ms'   │
└─────────┴───────────────────────┴────────────┘
✨  Done in 1.55s.
```

## License

MIT
