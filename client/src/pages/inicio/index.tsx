import './styles.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Product from '../../components/Product';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
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

function Home() {
    const [produtos, setProdutos] = useState<ProdutoItem[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newProduto, setNewProduto] = useState({
        nome: '',
        descricao: '',
        preco: '',
        quantidade: 0,
        categoria: 'bebida',
        imagem: '',
    });
    const [produtosFiltrados, setProdutosFiltrados] = useState<ProdutoItem[]>([]);
    const [areAdm, setAreAdm] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const carrinho = location.state?.carrinho || [];
    const user = location.state?.user || { id: 0, nome: '', email: '', senha: '', tipo: 'user' };
    const[isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (user.id > 0) {
            setAreAdm(user.tipo === 'adm');
            setIsLoggedIn(true);
        } else {
            setAreAdm(false);
        }

        async function fetchProdutos() {
            try {
                const response = await api.get('/produto');
                setProdutos(response.data);
                setProdutosFiltrados(response.data);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        }

        fetchProdutos();
    }, [user]);

    function formatarPreco(valor: string) {
        const valorLimpo = valor.replace(/\D/g, '');
        return (Number(valorLimpo) / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    }

    function handlePrecoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const precoFormatado = formatarPreco(e.target.value);
        setNewProduto({ ...newProduto, preco: precoFormatado });
    }

    async function handleAddProduto() {
        if(newProduto.nome && newProduto.descricao && newProduto.preco && newProduto.quantidade > 0 && newProduto.categoria && newProduto.imagem) {    
            try {
                const response = await api.post('/produto', newProduto);
                setProdutos([...produtos, { ...newProduto, id: response.data.id }]);
                setProdutosFiltrados([...produtos, { ...newProduto, id: response.data.id }]);
                setNewProduto({ nome: '', descricao: '', preco: '', quantidade: 0, categoria: '',imagem: '' });
                setIsAdding(false);
            } catch (error) {
                console.error('Erro ao adicionar produto:', error);
            }
        }else {
            alert('Todos os dados são obrigatórios!');
        }
    }

    function handleDelete(id: number) {
        setProdutos((prev) => prev.filter((produto) => produto.id !== id));
        setProdutosFiltrados((prev) => prev.filter((produto) => produto.id !== id));
    }

    function filtar(filtro: string) {
        setProdutosFiltrados(produtos.filter((produto) =>
            produto.categoria.toLowerCase().includes(filtro.toLowerCase())
        ));
    }

    function desfiltrar(){
        setProdutosFiltrados(produtos);
    }

    return (
        <>
            <Header />
            <div id="content">
                {carrinho.length > 0 && isLoggedIn ?
                    <div 
                        className="carrinhoPopUp"
                        onClick={() => navigate('/carrinho', {state : {user: user, produtos: carrinho}}) }
                    >
                        <i className="fa-solid fa-cart-shopping"></i>
                        <span>
                            {carrinho.length}
                        </span>
                    </div>
                    : null
                }
                <div className="historicoDeCompraPopUp">
                    <i className="fa-solid fa-history"></i>
                </div>
                <div className="filtro">
                    <button 
                        className="filtroBtn" 
                        onClick={() => filtar('hamburguer')}
                    >
                        Sanduíches 
                        <i className="fa-solid fa-burger"></i>
                    </button>
                    <button 
                        className="filtroBtn" 
                        onClick={() => filtar('bebida')}
                    >
                        Bebidas 
                        <i className="fa-solid fa-whiskey-glass"></i>
                    </button>
                    <button 
                        className="filtroBtn" 
                        onClick={() => filtar('acompanhamento')}
                    >   
                        Acompanhamentos 
                        <i className="fa-solid fa-bowl-food"></i>
                    </button>
                    <button 
                        className="filtroBtn" 
                        onClick={() => filtar('sobremesa')}
                    >  
                        Sobremesas 
                        <i className="fa-solid fa-ice-cream"></i>
                    </button>
                    <button 
                        className="tirarFiltro" 
                        onClick={desfiltrar}
                    >
                        <i className="fa-solid fa-x"></i>
                    </button>
                </div>
                <div className='cardapio'>
                    {produtosFiltrados.map((produto) => (
                        <Product
                            key={produto.id}
                            produto={produto}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
                {areAdm &&
                    <button className='add' onClick={() => setIsAdding(!isAdding)}>
                        {isAdding ? 'Cancelar' : 'Adicionar Produto'}
                    </button>
                }
               
                {isAdding && areAdm && (
                    <div className='newProductForm'>
                        <h1>Novo Produto</h1>
                        <input
                            type="text"
                            placeholder="Nome"
                            value={newProduto.nome}
                            onChange={(e) => setNewProduto({ ...newProduto, nome: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Descrição"
                            value={newProduto.descricao}
                            onChange={(e) => setNewProduto({ ...newProduto, descricao: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Preço"
                            value={newProduto.preco}
                            onChange={handlePrecoChange}
                        />
                        <input
                            type="number"
                            placeholder="Quantidade"
                            value={newProduto.quantidade}
                            onChange={(e) =>
                                setNewProduto({ ...newProduto, quantidade: Number(e.target.value) })
                            }
                        />
                        <select 
                            value={newProduto.categoria}
                            onChange={(e) => setNewProduto({...newProduto, categoria: e.target.value })}
                        >
                            <option value="bebida">Bebida</option>
                            <option value="hamburguer">Hamburguer</option>
                            <option value="sobremesa">Sobremesa</option>
                            <option value="acompanhamento">Acompanhamento</option>
                        </select>
                        <input
                            type="text"
                            placeholder="URL da imagem"
                            value={newProduto.imagem}
                            onChange={(e) => setNewProduto({ ...newProduto, imagem: e.target.value })}
                        />
                        <img src={newProduto.imagem} alt="" />
                        <button onClick={handleAddProduto}>Salvar Produto</button>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

export default Home;
