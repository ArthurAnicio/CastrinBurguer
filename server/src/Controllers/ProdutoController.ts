import { Request, Response } from "express";
import db from "../db/connection";

export default class ProdutoController{
    async index(req: Request, res: Response){
        try{
            const produtos = await db.select('*').from('produtos');
            return res.json(produtos);
        }catch(err){
            return res.status(400).json({error: `Erro ao buscar produtos: ${err}`});
        }
    }
    async getById(req: Request, res: Response){
        const {id} = req.query;

        if(id){
            try{
                const produto = await db.select('*').from('produtos').where('id', id);
                if(!produto.length){
                    return res.status(404).json({error: 'Produto não encontrado!'});
                }
                return res.json(produto[0]);
            }catch(err){
                return res.status(400).json({error: `Erro ao buscar produto: ${err}`});
            }
        }else{
            return res.status(400).json({error: 'ID do produto não fornecido!'});
        }
    }
    async create(req: Request, res: Response){
        const {nome, descricao, preco, quantidade, categoria, imagem} = req.body
        const trx = await db.transaction();

        if(!nome ||!descricao ||!preco ||!quantidade ||!categoria ||!imagem){
            await trx.rollback();
            return res.status(400).json({error: 'Todos os dados são obrigatórios!'});
        }else{
            try{
                await trx('produtos').insert({nome, descricao, quantidade, preco, categoria, imagem});
                await trx.commit();
                return res.status(200).json({message: 'Produto cadastrado com sucesso!'});
            }catch(err){
                await trx.rollback();
                return res.status(400).json({error: `Erro ao cadastrar produto: ${err}`});
            }
        }
    }
    async update(req: Request, res: Response){
        const {id, nome, descricao, quantidade, preco, categoria, imagem} = req.body
        const trx = await db.transaction();

        if(!nome ||!descricao ||!preco ||!quantidade ||!categoria ||!imagem){
            return res.status(400).json({error: 'Todos os dados são obrigatórios!'});
        }else{
            try{
                await trx('produtos')
                .update({nome, descricao, quantidade, preco, categoria, imagem})
                .where('id', id);
                await trx.commit();
                return res.status(200).json({message: 'Produto atualizado com sucesso!'});
            }catch(err){
                await trx.rollback();
               return res.status(400).json({error: `Erro ao atualizar produto: ${err}`});
            }
        }
    }
    async delete(req: Request, res: Response){
        const {id} = req.query
        const trx = await db.transaction();
        console.log(id);

        if(!id){
            return res.status(400).json({error: 'ID do produto não fornecido!'});
        }else{
            try{
                await trx('produtos')
                .delete()
                .where('id', id);
                await trx.commit();
                return res.status(200).json({message: 'Produto excluído com sucesso!'});
            }catch(err){
                await trx.rollback();
                return res.status(400).json({error: `Erro ao excluir produto: ${err}`});
            }
        }
    }
}