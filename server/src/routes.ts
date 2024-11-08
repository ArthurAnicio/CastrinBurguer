import express from 'express';
import ProdutoController from './ProdutoController';
import UserController from './UserController';
import { SECRET_KEY } from './UserController';
import jwt from 'jsonwebtoken';

const routes = express.Router();
const produtoController = new ProdutoController()
const userController = new UserController();

routes.get('/produto', produtoController.index)
routes.post('/produto', produtoController.create)
routes.put('/produto', produtoController.update)
routes.delete('/produto', produtoController.delete)

routes.get('/user', userController.login)
routes.put('/user', userController.swipeType)
routes.post('/user', userController.create)

routes.get("/validar", (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ isValid: false, message: "Token não fornecido" });
    }
  
    jwt.verify(token, SECRET_KEY, (err, decoded: any) => {
      if (err) {
        return res.status(403).json({ isValid: false, message: "Token inválido ou expirado" });
      }
  
      res.json({ isValid: true, tipo: decoded.tipo });
    });
});


export default routes;