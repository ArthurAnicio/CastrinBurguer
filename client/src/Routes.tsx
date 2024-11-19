import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/inicio";
import SignUp from "./pages/criarConta";
import Cart from "./pages/carrinho";
import Teste from "./pages/teste";

function RoutesWeb() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" Component={Home} />
                <Route path="/criar-conta" Component={SignUp} />
                <Route path="/carrinho" Component={Cart} />
                <Route path="/teste" Component={Teste}/>
            </Routes>
        </BrowserRouter>
    )
}

export default RoutesWeb;