import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import db from "./db/connection";

export const SECRET_KEY = "senhamuitosecretaefodonaeeuvoucolocarnumeropraficarmaissecreta123456789";

export default class UserController {
  async create(req: Request, res: Response) {
    const { nome, tipo, email, senha } = req.body;
    const trx = await db.transaction();

    try {
      await trx("user").insert({
        nome,
        tipo,
        email,
        senha,
      });
      await trx.commit();
      res.status(200).json({ message: "Usuário cadastrado com sucesso!" });
    } catch (err) {
      await trx.rollback();
      res.status(400).json({ error: `Erro ao cadastrar novo usuário: ${err}` });
    }
  }

  async login(req: Request, res: Response) {
    const { email, senha } = req.query;

    try {
      const user = await db("user").where({ email }).first();

      if (!user || user.senha !== senha) {
        return res.status(401).json({ error: "Email ou senha inválidos" });
      }

      const payload = {
        id: user.id,
        email: user.email,
        tipo: user.tipo,
      };

      const token = jwt.sign(
        payload,
        SECRET_KEY,
        { expiresIn: "5h" }
      );

      res.json(token);
    } catch (err) {
      res.status(400).json({ error: `Erro ao buscar usuário: ${err}` });
    }
  }

  async swipeType(req: Request, res: Response) {
    const { id, tipo } = req.body;
    const trx = await db.transaction();

    try {
      await trx("user").where({ id }).update({ tipo });
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
}
