import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/inicio";
import SignUp from "./pages/criarConta";
import Cart from "./pages/carrinho";
import Teste from "./pages/teste";
import UsersList from "./pages/usersList";
import PedidosList from "./pages/pedidoslist";
import AdmList from "./pages/AdmList";

function RoutesWeb() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" Component={Home} />
                <Route path="/criar-conta" Component={SignUp} />
                <Route path="/lista" Component={AdmList} />

                <Route path="/carrinho" Component={Cart} />
                <Route path="/teste" Component={Teste}/>
                <Route path="/usuarios" Component={UsersList} />
                <Route path="/pedidos" Component={PedidosList} />
            </Routes>
        </BrowserRouter>
    )
}

export default RoutesWeb;