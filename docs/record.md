# Records

Records express a single entry of record in zone.

## Data:

- label       (string, required)
- class       (string, hidden, default:IN)
- rr          (string, required, enum(A, CNAME, MX, NS, TXT))
- pref        (string, only-mx-required)
- value       (string, required)
