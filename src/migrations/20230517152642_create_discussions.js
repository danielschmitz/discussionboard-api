const table = "discussions"

const data = [
  {
    title: "My First Discussion",
    description: "This is my First Discussion Board Example",
    userId: 1,
  },
]

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable(table, (table) => {
      table.increments("id").primary()
      table.string("title", 80).notNullable()
      table.string("description")
      table.integer("votes").defaultTo(0)
      table.dateTime("createdAt").defaultTo(knex.fn.now())
      table.integer("userId").unsigned()
      table.foreign("userId").references("users.id")
    })
    .then(() => knex(table).insert(data))
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable(table)
}
