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
                produtos: JSON.stringify(produtos),
                preco,
                status
            });
            if(response.status === 201){
                alert('Pedido criado com sucesso!');
                navigate('/', { state: { user, carrinho: [] } });
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

    return (
        <>
            <Header />
            <div id="content">
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
                            onClick={criarPedido}
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
