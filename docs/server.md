# Servers

This application can manage multiple servers. Each server has their own zones.

## Data:

- name        (string, required, unique)
- adapter     (string, required, exists:adapter,name)
- options     (object, default:{})
- synced      (boolean, hidden, default:false)
- lastSynced  (datetime, hidden, default:null)

## API /server

### GET /

Get all server

```
curl http://localhost:3000/server'
```

### POST /

Add new server

```
curl http://localhost:3000/server -X POST -H 'Content-Type:application/json' -d '{"name":"local","adapter":"local"}'
```

### GET /{id}/sync

Sync server data

```
curl http://localhost:3000/server/ID/sync
```
