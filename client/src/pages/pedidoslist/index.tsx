import Footer from '../../components/Footer';
import Header from '../../components/Header';
import './styles.css';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../api';

interface Pedido{
    id:number;
    user_id:number;
    produtos: string;
    preco: string;
    status: string;
}

interface ProdutosLista{
    produtos: number[];
}
function PedidosList() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user || { id: 0, nome: '', email: '', senha: '', tipo: 'user' };
    const [isAdm, setIsAdm] = useState(false);
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [pedidosUser, setPedidosUser] = useState<Pedido[]>([]);
    const [nome, setNome] = useState('');
    const [nCartao, setNCartao] = useState('');
    const [isShooping, setIsShopping] = useState(false);
    const [pedidoId, setPedidoId] = useState(0);

    useEffect(() => {
        if (user.id > 0) {
            setIsAdm(user.tipo === 'adm');
        } else {
            setIsAdm(false);
        }
        fetchPedidos();
        fetchPedidosUser();
    }, []);


    async function fetchPedidos() {
        try {
            const response = await api.get('/pedido');
            const pedidos = response.data;
            setPedidos(pedidos);
        } catch (err) {
            console.error('Erro ao carregar pedidos:', err);
        }
    }   
    async function fetchPedidosUser() {
        try {
            const response = await api.get('/pedido');
            const pedidos = response.data.filter((pedido: Pedido) => pedido.user_id === user.id);
            // Processar os produtos diretamente ao buscar
            const pedidosComProdutos = pedidos.map((pedido: Pedido) => {
                try {
                    const produtos = JSON.parse(JSON.parse(pedido.produtos));
                    return { ...pedido, produtosArray: produtos.produtos || [] };
                } catch (error) {
                    console.error('Erro ao processar produtos:', error);
                    return { ...pedido, produtosArray: [] };
                }
            });
            setPedidosUser(pedidosComProdutos);
        } catch (err) {
            console.error('Erro ao carregar pedidos:', err);
        }
    }
    
    function aplicarMascaraCartao(valor: string) {
        const apenasNumeros = valor.replace(/\D/g, '').slice(0,16);
        const formatado = apenasNumeros.replace(/(\d{4})(?=\d)/g, '$1 ');
        return formatado.trim();
    }

    async function shop(){
        if(nome && nCartao) {
            try{
                console.log('Enviando ID:', pedidoId);
                const response = await api.delete(`/shop?id=${pedidoId}`)
                if(response.status === 200){
                    alert('Compra realizada com sucesso!');
                    setIsShopping(false);
                    navigate('/', { state: { user, carrinho: [] } });
                } else {
                    alert(response.data.error);
                }
            }catch(err){
                alert('Erro ao comprar.');
                setIsShopping(false);
                setNome('')
                setNCartao('');
            }
        } else {
            alert('Preencha todos os campos para realizar a compra.');
        }
    }

    async function apagar(){
        try{
            const response = await api.delete(`/pedido?id=${pedidoId}`)
            if(response.status === 200){
                fetchPedidos();
                fetchPedidosUser();
            } else {
                alert(response.data.error);
            }
        }catch(err){
            alert('Erro ao apagar o pedido.');
        }
    }

    async function updateStatus(id: number, status: string) {
        try {
            const response = await api.put('/pedido-status', { id, status });
            if (response.status === 200) {
                setPedidosUser((prevPedidos) =>
                    prevPedidos.map((pedido) =>
                        pedido.id === id ? { ...pedido, status } : pedido
                    )
                );
            } else {
                alert(response.data.error);
            }
            fetchPedidos();
        } catch (err) {
            alert('Erro ao atualizar o status do pedido.');
        }
    }

    return (
        <>
            <Header />
            <div id="content">
                <div
                    className="voltarAoInicio"
                    onClick={() => { navigate('/', {state:{user}}) }}
                >
                    <i className="fa-solid fa-arrow-left"></i>
                    Voltar ao início
                </div>
                { isShooping &&
                    <div className="pagamentoContainer">
                        <div className="popUpPagamento">
                            <h1>Pagamento</h1>
                            <div className='pagamentoForm'>
                                <div className="nomeCampo">
                                    <label>Nome:</label>
                                    <input 
                                        type="text" 
                                        placeholder='Nome completo'
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                    />
                                </div>
                                <div className="pagamentoCampo">
                                    <label>N° do Cartão:</label>
                                    <input 
                                        type="text" 
                                        placeholder='Número do cartão'
                                        value={nCartao}
                                        onChange={(e) => setNCartao(aplicarMascaraCartao(e.target.value))}
                                    />
                                    
                                </div>
                                <div className="tipoCampo">
                                    <label>Tipo de Pagamento:</label>
                                    <select name="pagamento" required>
                                        <option value="Cartão de Crédito">Cartão de Crédito</option>
                                        <option value="Cartão de Débito">Cartão de Débito</option>
                                    </select>
                                </div>
                                
                                <div className="opcoesBotoes">
                                    <button 
                                        className="comprar"
                                        onClick={shop}
                                    >
                                        Comprar
                                    </button>
                                    <button className="cancelarCompra" onClick={() => setIsShopping(false)}>
                                        Cancelar
                                    </button>    
                                </div>  
                                    
                            </div>
                        </div>
                    </div>
                }
                <div className="pedidosList">
                    {
                        isAdm?
                        pedidos.map((pedido: Pedido) => {
                            const isPayed = pedido.status !== 'Aguardando pagamento';
                            let produtosArray: number[] = [];
                        
                            try {
                                const produtos: ProdutosLista = JSON.parse(JSON.parse(pedido.produtos));
                                if (Array.isArray(produtos.produtos)) {
                                    produtosArray = produtos.produtos;
                                } else {
                                    console.error('produtos.produtos não é um array:', produtos.produtos);
                                }
                            } catch (error) {
                                console.error('Erro ao analisar produtos do pedido:', error);
                            }
                        
                            return (
                                <div
                                    key={pedido.id}
                                    className="pedidoItem"
                                >
                                    <h1>Pedido</h1>
                                    <div className="produtosPedido">
                                        Quantidade de itens: {produtosArray.length}
                                    </div>
                                    <p className='precoPedido'>Preço: {pedido.preco}</p>
                                    <div className="statusDePagamento">
                                        <span className='statusPedido'>Status:</span>
                                        <select
                                            onChange={(e) => updateStatus(pedido.id, e.target.value)}
                                            value={pedido.status} // Certifique-se de que o valor é atualizado
                                        >
                                            <option value="Aguardando pagamento">Aguardando pagamento</option>
                                            <option value="Enviado">Enviado</option>
                                            <option value="Entregue">Entregue</option>
                                        </select>
                        
                                        {isPayed ? 
                                            <p id='pago'>Pago</p> 
                                            : 
                                            <p id='naoPago'>Não pago</p>}
                                    </div>
                                    <button 
                                        className="apagar" 
                                        onClick={() => { setPedidoId(pedido.id); apagar(); }}
                                    >   
                                        Excluir
                                        <i 
                                            className="fa-solid fa-trash-alt"
                                        />
                                    </button>
                                </div>
                            );
                         })    
                        :
                            pedidosUser.map((pedido: Pedido) => {
                                const isPayed = pedido.status !== 'Aguardando pagamento';
                                let produtosArray: number[] = [];

                                try {
                                    const produtos: ProdutosLista = JSON.parse(JSON.parse(pedido.produtos));
                                    if (Array.isArray(produtos.produtos)) {
                                        produtosArray = produtos.produtos;
                                    } else {
                                        console.error('produtos.produtos não é um array:', produtos.produtos);
                                    }
                                } catch (error) {
                                    console.error('Erro ao analisar produtos do pedido:', error);
                                }

                                console.log('Array original:', produtosArray);
                                console.log('Quantidade de itens:', produtosArray.length);
                                return (
                                    <div
                                        key={pedido.id}
                                        className="pedidoItem"
                                    >
                                        <h1>Pedido</h1>
                                        <div className="produtosPedido">
                                    
                                            Quantidade de itens: {produtosArray.length}
                                        </div>
                                        <p className='precoPedido'>Preço: {pedido.preco}</p>
                                        <div className="statusDePagamento">
                                            <span className='statusPedido'>Status: {pedido.status}</span>
                                            
                                            {isPayed ? 
                                                    <p>Pago</p> 
                                                : 
                                                    <div 
                                                            className='pagar'
                                                            onClick={()=>{setPedidoId(pedido.id); setIsShopping(true)}}
                                                        >
                                                            <i className="fa-solid fa-money-check-dollar"></i>
                                                    </div>
                                            }
                                                
                                            
                                        </div>
                                        <button 
                                            className="apagar" 
                                            onClick={() => { setPedidoId(pedido.id); apagar(); }}
                                        >   
                                            Excluir
                                            <i 
                                                className="fa-solid fa-trash-alt"
                                            />
                                        </button>
                                    </div>
                                );
                            })
                    }
                </div>
            </div>
            <Footer />
        </>
    );
}

export default PedidosList;