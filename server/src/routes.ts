import express from 'express';
import ProdutoController from './Controllers/ProdutoController';
import UserController from './Controllers/UserController';
import PedidoController from './Controllers/PedidoController';
//import { SECRET_KEY } from './UserController';
//import jwt from 'jsonwebtoken';

const routes = express.Router();
const produtoController = new ProdutoController();
const userController = new UserController();
const pedidoController= new PedidoController();

//routes Produtos
routes.get('/produto', produtoController.index);
routes.get('/produto-id', produtoController.getById);
routes.post('/produto', produtoController.create);
routes.put('/produto', produtoController.update);
routes.delete('/produto', produtoController.delete);

//routes Users
routes.get('/user', userController.login);
routes.get('/all-users', userController.index);
routes.put('/user', userController.swipeType);
routes.post('/user', userController.create);
routes.delete('/user', userController.delete);

//routes Pedidos
routes.get('/pedido', pedidoController.index);
routes.post('/pedido', pedidoController.create);
routes.put('/pedido-produtos', pedidoController.updateProducts);
routes.put('/pedido-preco', pedidoController.updatePrice);
routes.put('/pedido-status', pedidoController.updateStatus);
routes.delete('/shop', pedidoController.shop);
routes.delete('/pedido', pedidoController.delete);


/*routes.get("/validar", (req, res) => {
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
});*/


export default routes;