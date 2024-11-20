import './styles.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Product from '../../components/Product';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api';

interface ProdutoItem {
    id: number;
    nome: string;
    descricao: string;
    preco: string;
    quantidade: number;
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
        imagem: '',
    });
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [produtosFiltrados, setProdutosFiltrados] = useState<ProdutoItem[]>([]);
    const [areAdm, setAreAdm] = useState(false);

    const location = useLocation();
    const user = location.state?.user || { id: 0, nome: '', email: '', senha: '', tipo: 'user' };

    useEffect(() => {
        if (user.id > 0) {
            setAreAdm(user.tipo === 'admin');
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
        try {
            const response = await api.post('/produto', newProduto);
            console.log('Produto adicionado:', response.data);
            setProdutos([...produtos, { ...newProduto, id: response.data.id }]);
            setProdutosFiltrados([...produtos, { ...newProduto, id: response.data.id }]);
            setNewProduto({ nome: '', descricao: '', preco: '', quantidade: 0, imagem: '' });
            setIsAdding(false);
        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
        }
    }

    function handleDelete(id: number) {
        setProdutos((prev) => prev.filter((produto) => produto.id !== id));
        setProdutosFiltrados((prev) => prev.filter((produto) => produto.id !== id));
    }

    function filtar() {
        const produtosFiltrados = produtos.filter((produto) => {
            const preco = Number(produto.preco.replace(/\D/g, '')) || 0;
            const fromValue = from ? Number(from.replace(/\D/g, '')) : 0;
            const toValue = to ? Number(to.replace(/\D/g, '')) : Infinity;
            return preco >= fromValue && preco <= toValue;
        });
        setProdutosFiltrados(produtosFiltrados);
        setFrom('');
        setTo('');
    }

   
    return (
        <>
            <Header />
            <div id="content">
                {
                    <button onClick={() => setIsAdding(!isAdding)}>
                        {isAdding ? 'Cancelar' : 'Adicionar Produto'}
                    </button>
}
               
                {isAdding && areAdm && (
                    <div>
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
                        <input
                            type="text"
                            placeholder="URL da imagem"
                            value={newProduto.imagem}
                            onChange={(e) => setNewProduto({ ...newProduto, imagem: e.target.value })}
                        />
                        <button onClick={handleAddProduto}>Salvar Produto</button>
                    </div>
                )}
                <div>
                    {produtosFiltrados.map((produto) => (
                        <Product
                            key={produto.id}
                            produto={produto}
                            onDelete={areAdm ? handleDelete : undefined}
                        />
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Home;
