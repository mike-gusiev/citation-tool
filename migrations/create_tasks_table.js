exports.up = function(knex) {
    return knex.schema.createTable('tasks', (table) => {
      table.increments('id').primary();
      table.uuid('task_id').notNullable().unique().index();
      table.integer('user_id').notNullable().index();
      table.string('keyword').notNullable();
      table.string('keyword_type').notNullable();
      table.string('status').defaultTo('pending');
      table.string('check_url')
      table.integer('url_qty').defaultTo(0);
      table.string('excel_file_path')
      table.jsonb('result_data')
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('tasks');
  };
  