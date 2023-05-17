const bcrypt = require("bcrypt")
const password = "123456"
const hash = bcrypt.hashSync(password, 10)

const table = "users"

const data = [
  {
    name: "user1",
    email: "user1@email.com",
    password: hash,
    isAdmin: true,
  },
  {
    name: "user2",
    email: "user2@email.com",
    password: hash,
    isAdmin: false,
  },
  {
    name: "user3",
    email: "user3@email.com",
    password: hash,
    isAdmin: false,
  },
]

exports.up = function (knex, _Promise) {
  return knex.schema
    .createTable(table, (table) => {
      table.increments("id").primary()
      table.string("name", 80).notNullable()
      table.string("email", 80).notNullable()
      table.string("password", 80).notNullable()
      table.boolean("isAdmin").defaultTo(0)
    })
    .then(() => knex(table).insert(data))
}

exports.down = function (knex, _Promise) {
  return knex.schema.dropTable(table)
}
