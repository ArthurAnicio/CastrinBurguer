import { Request, Response } from "express";
import db from "./db/connection";

export default class ProdutoController{
    async index(req: Request, res: Response){
        try{
            const produtos = await db.select('*').from('produtos');
            res.json(produtos);
        }catch(err){
            res.status(400).json({error: `Erro ao buscar produtos: ${err}`});
        }
    }

    async create(req: Request, res: Response){
        const {nome, descricao, quantidade, preco} = req.body
        const trx = await db.transaction();

        try{
            await trx('produtos').insert({nome, descricao, quantidade, preco});
            await trx.commit();
            res.status(200).json({message: 'Produto cadastrado com sucesso!'});
        }catch(err){
            res.status(400).json({error: `Erro ao cadastrar produto: ${err}`});
        }
    }

    async update(req: Request, res: Response){
        const {id, nome, descricao, quantidade, preco} = req.body
        const trx = await db.transaction();

        try{
            await trx('produtos')
               .update({nome, descricao, quantidade, preco})
               .where('id', id);
            await trx.commit();
            res.status(200).json({message: 'Produto atualizado com sucesso!'});
        }catch(err){
            res.status(400).json({error: `Erro ao atualizar produto: ${err}`});
        }
    }

    async delete(req: Request, res: Response){
        const {id} = req.query
        const trx = await db.transaction();

        try{
            await trx('produtos')
               .delete()
               .where('id', id);
            await trx.commit();
            res.status(200).json({message: 'Produto excluído com sucesso!'});
        }catch(err){
            res.status(400).json({error: `Erro ao excluir produto: ${err}`});
        }
    }
}