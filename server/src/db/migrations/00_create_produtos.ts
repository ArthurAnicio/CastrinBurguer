import { Knex } from 'knex';

export async function up(knex: Knex){
    return (
        knex.schema.createTable('produtos', (table) => {
            table.increments('id').primary();
            table.string('nome').notNullable();
            table.string('descricao').notNullable().unique();
            table.string('preco').notNullable();
            table.integer('quantidade').notNullable();
            table.string('categoria').notNullable();
            table.string('imagem').notNullable;
        })  
    )
}

export async function down(knex: Knex){
    return knex.schema.dropTable('produtos')
}