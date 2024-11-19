import { Knex } from 'knex';

export async function up(knex: Knex){
    return (
        knex.schema.createTable('pedidos', (table) => {
            table.increments('id').primary();
            table.integer("user_id")
            .notNullable()
            .references("id")
            .inTable("users")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
            table.json("produtos").notNullable();
            table.string('preco').notNullable();
            table.string('status').notNullable();
        })  
    )
}

export async function down(knex: Knex){
    return knex.schema.dropTable('pedidos')
}