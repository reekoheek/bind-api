module.exports = function ({ dbdir, zone: { name } }) {
  return `zone "${name}" {\n  type master;\n  file "${dbdir}/db.${name}";\n};\n`;
};
