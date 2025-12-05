export default {
  dialect: 'postgres',
  // Output settings
  outFile: 'lib/db/generated/db-types.ts',
  schema: ['public','debug_log'],
  camelCase: false,
  exportMode: 'named',
  strictMode: true
}
