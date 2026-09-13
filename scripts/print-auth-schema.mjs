import { getAuthTables } from 'better-auth/db'

const tables = getAuthTables({
  emailAndPassword: { enabled: true },
})

for (const [key, table] of Object.entries(tables)) {
  console.log(`\nTABLE ${key} -> ${table.modelName}`)
  for (const [field, def] of Object.entries(table.fields)) {
    console.log(
      `  ${field} -> col=${def.fieldName || field} type=${def.type} required=${def.required} unique=${!!def.unique} references=${def.references ? def.references.model + '.' + def.references.field : ''}`,
    )
  }
}
