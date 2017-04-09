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

## API /server/{serverId}/zone

### GET /

Get all zone

```
curl http://localhost:3000/server/ID/zone
```

### POST /

Add new server

```
curl http://localhost:3000/server/ID/zone -X POST -H 'Content-Type:application/json' -d '{"name":"foo.bar","master":"ns.foo.bar","email":"admin@foo.bar","records":[{"label":"@","rr":"NS","value":"ns"},{"label":"@","rr":"A","value":"1.1.1.1"},{"label":"ns","rr":"A","value":"1.1.1.2"}]}'
```

### PUT /{id}

Update server

```
curl http://localhost:3000/server/SERVERID/zone/ID -X PUT -H 'Content-Type:application/json' -d '{"email":"webmaster@foo.bar"}'
```
