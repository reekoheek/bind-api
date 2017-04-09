# Adapters

Available adapter of system

## Data

- name        (string)
- source      (string)
- etcdir      (string)
- dbdir       (string)

## Create custom adapter

Adapter must implements:

- .initialize()
- .exists(kind, file)
- .write(kind, file, content)
- .reload()

Kind value are conf and db
