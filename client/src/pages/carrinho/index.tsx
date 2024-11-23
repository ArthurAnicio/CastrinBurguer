import Footer from '../../components/Footer';
import Header from '../../components/Header';
import './styles.css';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../api';

interface ProdutoItem {
    id: number;
    nome: string;
    descricao: string;
    preco: string;
    quantidade: number;
    categoria: string;
    imagem: string;
}

function Cart() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user || { id: 0, nome: '', email: '', senha: '', tipo: 'user' };
    var produtos = location.state?.produtos || [];
    const [nome, setNome] = useState('');
    const [nCartao, setNCartao] = useState('');
    const [isShooping, setIsShopping] = useState(false)
    const [pedidoId, setPedidoId] = useState(0)
    const user_id = user.id;
    const [preco, setPreco] = useState('');
    const status= 'Aguardando pagamento';
    const [produtosArray, setProdutosArray] = useState<ProdutoItem[]>([]);

    useEffect(() => {
        fetchProdutos();
    }, []);

    async function fetchProdutos() {
        console.log('Carrinho:'+produtos);
        if (produtos.length <= 0) {
            navigate('/', { state: { user, carrinho: produtos } });
            return;
        }
        try {
            const fetchedProdutos: ProdutoItem[] = [];
            let total = 0;

            for (const produtoId of produtos) {
                const response = await api.get(`/produto-id?id=${produtoId}`);
                const produto: ProdutoItem = response.data;
                if (response.status === 200) {
                    fetchedProdutos.push(produto);
                    total += desformatarPreco(produto.preco);
                } else {
                    console.error(`Erro ao buscar produto ${produtoId}: ${response.status}`);
                    navigate('/', { state: { user, carrinho: produtos } });
                    return;
                }
            }

            setProdutosArray(fetchedProdutos);
            setPreco(formatarPreco(total));
        } catch (error) {
            console.error("Erro durante a busca de produtos:", error);
            navigate('/', { state: { user, carrinho: produtos } });
        }
    }

    async function criarPedido(){
        try{
            const response = await api.post('/pedido', {
                user_id,
                produtos: JSON.stringify({produtos}),
                preco,
                status
            });
            if(response.status === 201){
                setPedidoId(response.data)
            } else {
                alert(response.data.error);
            }   
        }catch(error){
            console.error("Erro ao tentar cadastrar o pedido:", error);
            alert('Erro ao tentar cadastrar o pedido.');
        }
    }

    function formatarPreco(valor: number) {
        return `R$ ${valor.toFixed(2).replace('.', ',')}`;
    }

    function desformatarPreco(valor: string) {
        const valorLimpo = valor.replace(/R\$\s*/g, '').replace(',', '.');
        const valorNumerico = parseFloat(valorLimpo);
        return isNaN(valorNumerico) ? 0 : valorNumerico;
    }

    function removerItem(valor: number){
        produtos.pop(valor);
        fetchProdutos();
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

    return (
        <>
            <Header />
            <div id="content">
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
                <div className="pedido">
                    <h1>Sacola</h1>
                    <h2>Itens:</h2>
                    <div className="itens">
                        {produtosArray.map((produto, index) => (
                            <div key={index} className='produtoItem'>
                                <img src={produto.imagem} alt={produto.nome} />
                                <label>{produto.nome}</label>
                                <label>{produto.preco}</label>
                                <i className="fa-solid fa-trash" onClick={()=>removerItem(produto.id)}></i>
                            </div>
                        ))}
                        <button 
                            className="retornar"
                            onClick={() => navigate('/', { state: { user, carrinho: produtos } })}
                        >
                            Adicionar mais Itens
                            <i className="fa-solid fa-plus"></i>
                        </button>
                    </div>
                    <div className="precoFinal">
                        Preço Final: {preco}
                    </div>
                    <div className="opcoes">
                        <button 
                            id="finalizar"
                            onClick={() => {criarPedido(); setIsShopping(true)}}
                        >
                            Finalizar Pedido
                        </button>
                        <button 
                            id="cancelar"
                            onClick={() => navigate('/', { state: { user, carrinho: [] } })}
                        >
                            Cancelar Pedido
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Cart;
