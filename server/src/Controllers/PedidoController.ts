import { Request, Response } from "express";
import db from "../db/connection";

export default class PedidoController {
    async index(req: Request, res: Response) {
        try {
            const pedidos = await db.select('*').from('pedidos');
            res.json(pedidos);
        } catch (err) {
            res.status(400).json({ error: `Erro ao buscar pedidos: ${err}` });
        }
    }

    async create(req: Request, res: Response) {
        const { user_id, produtos, preco, status } = req.body;
        const trx = await db.transaction();
    
        if (user_id && produtos && preco && status) {
            try {
                const [pedidoId] = await trx("pedidos").insert({
                    user_id,
                    produtos: JSON.stringify(produtos),
                    preco,
                    status
                });
                await trx.commit();
                res.status(201).json(pedidoId);
            } catch (err) {
                await trx.rollback();
                res.status(400).json({ error: `Erro ao cadastrar pedido: ${err}` });
            }
        } else {
            res.status(400).json({ error: 'Todos os dados são obrigatórios!' });
        }
    }

    async updateProducts(req: Request, res: Response) {
        const { id, produtos } = req.body;
        const trx = await db.transaction();
    
        if (id && produtos) {
            try {
                await trx('pedidos')
                    .update({ produtos: JSON.stringify(produtos) }) 
                    .where('id', id);
                await trx.commit();
                res.status(200).json({ message: 'Produtos do pedido atualizados com sucesso!' });
            } catch (err) {
                await trx.rollback();
                res.status(400).json({ error: `Erro ao atualizar produtos do pedido: ${err}` });
            }
        } else {
            res.status(400).json({ error: 'Os dados são obrigatórios!' });
        }
    }

    async updateStatus(req: Request, res: Response){
        const { id, status } = req.body;
        const trx = await db.transaction();

        if (id && status) {
            try {
                await trx('pedidos')
                   .update({ status })
                   .where('id', id);
                await trx.commit();
                res.status(200).json({ message: 'Status do pedido atualizado com sucesso!' });
            } catch (err){
                await trx.rollback();
                res.status(400).json({ error: `Erro ao atualizar status do pedido: ${err}` });
            }
        }else{
            res.status(400).json({ error: 'Os dados são obrigatórios!' });
        }
    }
    
    async updatePrice(req: Request, res: Response){
        const { id, preco } = req.body;
        const trx = await db.transaction();

        if (id && preco) {
            try {
                await trx('pedidos')
                   .update({ preco })
                   .where('id', id);
                await trx.commit();
                res.status(200).json({ message: 'Preço do pedido atualizado com sucesso!' });
            } catch (err){
                await trx.rollback();
                res.status(400).json({ error: `Erro ao atualizar preço do pedido: ${err}` });
            }
        }else{
            res.status(400).json({ error: 'Os dados são obrigatórios!' });
        }
    }
    async shop(req: Request, res: Response) {
        const { id } = req.query;
        const trx = await db.transaction();
        console.log('id recebido:'+id);
        if (!id) {
            return res.status(400).json({ error: 'ID do pedido é obrigatório!' });
        }
    
        try {
            const pedido = await trx('pedidos')
                .select('produtos')
                .where({ id })
                .first();
            
            console.log(pedido)

            if (!pedido) {
                return res.status(404).json({ error: 'Pedido não encontrado!' });
            }

            const rawProdutos = pedido.produtos;
            const produtos = typeof rawProdutos === 'string' && rawProdutos.startsWith('"')
                ? JSON.parse(JSON.parse(rawProdutos))
                : JSON.parse(rawProdutos);
            
            console.log(produtos)
    
            for (const produtoId of produtos) {
                console.log('Id:'+produtoId)
                const produto = await trx('produtos')
                    .where('id', produtoId)
                    .first();
                console.log('Produto:'+produto)
                if (!produto || produto.quantidade <= 0) {
                    await trx.rollback();
                    return res.status(400).json({ 
                        error: `Produto com ID ${produtoId} está fora de estoque ou não existe.` 
                    });
                }
    
                await trx('produtos')
                    .where('id', produtoId)
                    .decrement('quantidade', 1);
            }
            await trx('pedidos')
                   .update({status: "Enviado"})
                   .where('id', id);
            await trx.commit();
            res.status(200).json({ message: 'Pedido realizado com sucesso!' });
        } catch (err) {
            await trx.rollback();
            return res.status(400).json({ error: `Erro ao atualizar os produtos do pedido: ${err}` });
        }
    }
    async delete(req: Request, res: Response){
        const { id } = req.query
        const trx = await db.transaction();

        if(id){
            try {
                await trx('pedidos')
                   .where('id', id)
                   .del();
                await trx.commit();
                res.status(200).json({ message: 'Pedido excluído com sucesso!' });
            } catch (err){
                await trx.rollback();
                res.status(400).json({ error: `Erro ao excluir pedido: ${err}` });
            }
        }else{
            res.status(400).json({ error: 'ID do pedido é obrigatório!' });
            return;
        }
    }
    
    
}