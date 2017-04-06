# Zones

Zones express single domain zone. Each zone has their own records.

## Data:

- name        (string, required, unique) // $ORIGIN
- master      (string, required)
- email       (string, required)
- refresh     (number, default:10800)
- retry       (number, default:3600)
- expire      (number, default:604800)
- ttl         (number, default:38400) // $TTL and last entry SOA
- records     (array, of(record))
