# Bind API

Bind API is a JSON REST API for Bind (DNS Server)

## Servers

This application can manage multiple servers. Each server has their own zones.

### Data:

- name        (string, required, unique)
- adapter     (string, required)
- options     (object, default:{})
- synced      (boolean, hidden, default:false)
- lastSynced  (datetime, hidden, default:null)

## Zones

Zones express single domain zone. Each zone has their own records.

### Data:

- name        (string, required, unique) // $ORIGIN
- master      (string, required)
- email       (string, required)
- refresh     (number, default:10800)
- retry       (number, default:3600)
- expire      (number, default:604800)
- ttl         (number, default:38400) // $TTL and last entry SOA

## Records

Records express a single entry of record in zone.

### Data:

- label       (string, required)
- class       (string, hidden, default:IN)
- rr          (string, required, enum(A, CNAME, MX, NS, TXT))
- pref        (string, only-mx-required)
- value       (string, required)
