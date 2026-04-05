# json-serialize

## Installation

```bash
bun install
```

## How to Run

```bash
bun run bench
```

## Results

This result on Macbook Pro M1 Max 16" (10-core, 64GB memory)

```bash
❯ bun run bench
$ vitest bench .
Benchmarking is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.

 DEV  v4.1.2 /Users/dalisoft/Desktop/OS-nanoexpress-js/json-serialize


 ✓ serialize.bench.js > serialize 31389ms
     name                               hz     min      max    mean     p75     p99    p995    p999     rme   samples
   · JSON.stringify           4,473,618.96  0.0001   0.6891  0.0002  0.0002  0.0003  0.0003  0.0007  ±0.13%  10000000
   · fast-json-stringify      6,163,091.80  0.0000   2.0767  0.0002  0.0002  0.0002  0.0003  0.0006  ±0.47%  10000000
   · compile-json-stringify   9,751,186.53  0.0000  17.6072  0.0001  0.0001  0.0001  0.0001  0.0005  ±3.40%  10000000
   · slow-json-stringify     12,227,965.94  0.0000   1.2345  0.0001  0.0001  0.0001  0.0001  0.0002  ±0.40%  10000000
   · avsc                     2,523,840.36  0.0002   0.6524  0.0004  0.0004  0.0005  0.0006  0.0010  ±0.16%  10000000
   · msgpackR                 2,611,162.30  0.0002   1.5606  0.0004  0.0004  0.0008  0.0011  0.0015  ±0.17%  10000000

 BENCH  Summary

  slow-json-stringify - serialize.bench.js > serialize
    1.25x faster than compile-json-stringify
    1.98x faster than fast-json-stringify
    2.73x faster than JSON.stringify
    4.68x faster than msgpackR
    4.84x faster than avsc
```

## License

MIT
