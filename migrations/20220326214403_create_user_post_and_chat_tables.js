/* eslint-disable max-len */
/* eslint-disable indent */
exports.up = function (knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.bigInteger('google_id').notNullable();
      table.string('avatar_url').notNullable();
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      table.string('address');
      table.string('city');
      table.string('province');
      table.string('phone');
      table.string('email').notNullable().unique();
      table.string('volunteer');
      table.timestamps(true, true);
    })
    .createTable('posts', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.string('title', 100).notNullable();
      table.text('description').notNullable();
      table.string('category').notNullable();
      table.string('pic_url');
      table.boolean('offer').notNullable();
      table.boolean('active').notNullable();
      table.timestamps(true, true);
      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
    .createTable('chats', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.integer('recipient_id').unsigned().notNullable();
      table.timestamps(true, true);
      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .foreign('recipient_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
    .createTable('messages', (table) => {
      table.increments('id').primary();
      table.integer('chat_id').unsigned().notNullable();
      table.integer('user_id').unsigned().notNullable();
      table.timestamp('sent_at').defaultTo(knex.fn.now());
      table
        .foreign('chat_id')
        .references('id')
        .inTable('chats')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('messages').dropTable('chats').dropTable('posts').dropTable('users');
};
