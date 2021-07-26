exports.up = function (knex) {
  return knex.schema.createTable('cars', table => {
    table.increments('car_id')
    table.text('vin').unique().notNullable()
    table.text('make').notNullable()
    table.text('model').notNullable()
    table.integer('mileage').notNullable()
    table.text('transmission')
    table.text('title')
  })
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('cars')
};
