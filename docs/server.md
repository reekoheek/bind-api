# Servers

This application can manage multiple servers. Each server has their own zones.

## Data:

- name        (string, required, unique)
- adapter     (string, required, exists:adapter,name)
- options     (object, default:{})
- synced      (boolean, hidden, default:false)
- lastSynced  (datetime, hidden, default:null)
