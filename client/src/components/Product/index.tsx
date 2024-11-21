import './styles.css';
import api from '../../api';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ProdutoProps {
    produto: {
      id: number;
      nome: string;
      descricao: string;
      preco: string;
      quantidade: number;
      categoria: string;
      imagem: string;
    };
    onDelete: (id: number) => void;
}

const Product: React.FC<ProdutoProps> = ({ produto, onDelete }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [vendoDetalhes, setVendoDetalhes] = useState(false);
    const [adm, setAdm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [nome, setNome] = useState(produto.nome);
    const [descricao, setDescricao] = useState(produto.descricao);
    const [preco, setPreco] = useState(produto.preco);
    const [quantidade, setQuantidade] = useState(produto.quantidade);
    const [categoria, setCategoria] = useState(produto.categoria);
    const [imagem, setImagem] = useState(produto.imagem);
    const carrinho = location.state?.carrinho || [];
    const user = location.state?.user || { id: 0, nome: '', email: '', senha: '', tipo: 'user' };
    console.log(produto.id);

    useEffect(() => {
        if (user.id > 0) {
            setAdm(user.tipo === 'adm');
        } else {
            setAdm(false);
        }
    }, [user]);

    async function editarProduto() {
        try {
            const atualizadoProduto = {
                id: produto.id,
                nome,
                descricao,
                preco,
                quantidade,
                categoria,
                imagem,
            };
            await api.put(`/produto`, atualizadoProduto);
            setIsEditing(false); 
        } catch (error) {
            console.error('Erro ao editar o produto:', error);
        }
    }

    async function excluirProduto() {
        try {
            await api.delete(`/produto?id=${produto.id}`); 
            onDelete(produto.id);
        } catch (error) {
            console.error('Erro ao excluir o produto:', error);
        }
    }


    function formatarPreco(valor: string) {
        const valorLimpo = valor.replace(/\D/g, '');
        return (Number(valorLimpo) / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    }

    function handlePrecoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const precoFormatado = formatarPreco(e.target.value);
        setPreco(  precoFormatado );
    }

    function calcularPrecoFalso(preco: string) {
        const valorNumerico = parseFloat(preco.replace(/[^\d,]/g, '').replace(',', '.')); 
        if (isNaN(valorNumerico)) return 'R$ 0,00'; 
        const precoFalso = valorNumerico * 1.5; 
        return precoFalso.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function adicionarAoCarrionho(){
        carrinho.push(produto.id);
        setVendoDetalhes(false);
        navigate('/', { state: { carrinho, user } });
    }

    return (
        <div onClick={() => (vendoDetalhes? null : setVendoDetalhes(true)) } className={vendoDetalhes ? 'produtoGrandao' : 'produtoNormal'}>
            <div className="img">
                <img className='imagem' src={imagem} alt="Imagem do produto" />
                {vendoDetalhes ? <i onClick={()=>setVendoDetalhes(false)} className="fa-solid fa-x" id='sair'></i>: null}
            </div>
            {vendoDetalhes ? (
                <>
                    <div className="detalhes">
                        <div className='infoProduto'>
                            <section>
                                <input
                                    type='text'
                                    className='nomeProduto'
                                    value={nome}
                                    onChange={(e)=>setNome(e.target.value)}
                                    disabled={!isEditing}
                                />
                                <input
                                    type='text'
                                    className='descricaoProduto'
                                    value={descricao}
                                    onChange={(e)=>setDescricao(e.target.value)}
                                    disabled={!isEditing}
                                />
                                {adm && 
                                    <>
                                        <div className="quantCampo">
                                            <label>Quantidade:</label>
                                            <input
                                                type='number'
                                                className='quantidadeProduto'
                                                value={quantidade}
                                                onChange={(e)=>setQuantidade(Number(e.target.value))}
                                                disabled={!isEditing} 
                                            />
                                        </div>
                                        <div className="urlCampo">
                                            <label>URL da imagem:</label>
                                            <input
                                                type='url'
                                                className='urlImagem'
                                                value={imagem}
                                                onChange={(e)=>setImagem(e.target.value)}
                                                disabled={!isEditing} 
                                            />
                                        </div>
                                        <div className="categoriaCampo">
                                            <label>Categoria:</label>
                                            <select
                                                className='selectCategoria' 
                                                value={produto.categoria} 
                                                onChange={(e) => setCategoria(e.target.value)}
                                            >
                                                 <option value="bebida">Bebida</option>
                                                 <option value="hamburguer">Hamburguer</option>
                                                 <option value="sobremesa">Sobremesa</option>
                                                 <option value="acompanhamento">Acompanhamento</option>
                                            </select>
                                        </div>
                                    </>
                                }
                            </section>
                            <section>
                                <div className="preco">
                                    <input
                                        type='text'
                                        className="precoCerto"
                                        value={preco}
                                        onChange={handlePrecoChange}

                                        disabled={!isEditing}
                                    />
                                    <span className='precoFalso'>
                                        {calcularPrecoFalso(preco)}
                                    </span>
                                </div>
                                <button className='adicionar' onClick={adicionarAoCarrionho}>
                                    <i className="fa-solid fa-cart-plus"></i>
                                </button>    
                            </section>
                        </div>
                        {adm && 
                            <>
                                <div className="administracao">
                                    <button onClick={() => setIsEditing(!isEditing)} className='editar'>
                                        {isEditing ? 'Cancelar' : 'Editar'}
                                    </button>
                                    {isEditing &&
                                        <button onClick={editarProduto} className="salvar">
                                            Salvar
                                        </button>
                                    }
                                    <button onClick={excluirProduto} className="excluir">
                                        Excluir
                                    </button>
                                </div>
                            </>
                        }
                    </div>
                </>
            ) : (
                <h1>{produto.nome}</h1>
            )}
        </div>
    );
}

export default Product;
