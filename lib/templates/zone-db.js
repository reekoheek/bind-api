module.exports = function ({ zone: { name, master, email, serial, refresh, retry, expire, ttl, records } }) {
  return `
$TTL\t\t${ttl}
$ORIGIN\t\t${name}.
@\tIN\tSOA\t\t${master}. ${email.replace('@', '.')}. (
\t\t\t\t${serial}
\t\t\t\t${refresh}
\t\t\t\t${retry}
\t\t\t\t${expire}
\t\t\t\t${ttl} )
${templateZoneRecords({ records })}`;
};

function templateZoneRecords ({ records }) {
  return records.map(({ label, rr, pref, value }) => {
    return `${label}\tIN\t${rr}\t${pref || ''}\t${value}`;
  }).join('\n');
}
