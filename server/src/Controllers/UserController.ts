import { Request, Response } from "express";
//import jwt from "jsonwebtoken";
import db from "../db/connection";

//export const SECRET_KEY = "senhamuitosecretaefodonaeeuvoucolocarnumeropraficarmaissecreta123456789";

export default class UserController {

  async index(req: Request, res: Response) {
    try {
      const users = await db("users").select('*');
      res.status(200).json(users);
    } catch (err) {
      res.status(400).json({ error: `Erro ao buscar usuários: ${err}` });
    }
  }
  async create(req: Request, res: Response) { 
    const { nome, email, senha, tipo } = req.body;
    const trx = await db.transaction();
  
    if (nome && email && senha && tipo) {
      try {
        const verifyUser = await trx("users").select("*").where({ email });
  
        if (verifyUser.length > 0) {
          await trx.rollback();
          return res.status(206).json({ error: "Email já cadastrado!" });
        } else {
          
          const [userId] = await trx("users").insert({ nome, email, senha, tipo });
          await trx.commit(); 
  
          return res.status(200).json({ id: userId, nome, email, tipo });
        }
      } catch (err) {
        await trx.rollback(); // Reverte a transação em caso de erro
        return res.status(400).json({ error: `Erro ao cadastrar novo usuário: ${err}` });
      }
    } else {
      return res.status(400).json({ error: "Os dados são obrigatórios!" });
    }
  }
  async login(req: Request, res: Response) {
    const { email, senha } = req.query;
    try {
      const user = await db("users").where({ email }).first();
      if (!user || user.senha !== senha) {
        return res.status(401).json({ error: "Email ou senha inválidos" });
      }else {
        res.status(200).json(user)
      }
    } catch (err) {
      res.status(400).json({ error: `Erro ao buscar usuário: ${err}` });
    }
  }

  async swipeType(req: Request, res: Response) {
    const { id, tipo } = req.body;
    const trx = await db.transaction();

    try {
      await trx("users").where({ id }).update({ tipo });
      await trx.commit();
      res
        .status(200)
        .json({ message: "Tipo de desencadeamento atualizado com sucesso!" });
    } catch (err) {
      await trx.rollback();
      res
        .status(400)
        .json({ error: `Erro ao atualizar tipo de desencadeamento: ${err}` });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.query;
    const trx = await db.transaction();

    try {
      await trx("users").where({ id }).delete();
      await trx.commit();
      res.status(200).json({ message: "Usuário excluído com sucesso!" });
    } catch (err) {
      await trx.rollback();
      res.status(400).json({ error: `Erro ao excluir usuário: ${err}` });
    }
  }
}
