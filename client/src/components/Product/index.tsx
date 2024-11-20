import './styles.css';
import api from '../../api';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface ProdutoProps {
    produto: {
      id: number;
      nome: string;
      descricao: string;
      preco: string;
      quantidade: number;
      image: string;
    };
    onDelete: (id: number) => void;
  }
  const Product: React.FC<ProdutoProps> = ({ produto, onDelete }) => {
    const location = useLocation();
    const [vendoDetalhes, setVendoDetalhes] = useState(false);
    const [adm, setAdm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [nome, setNome] = useState(produto.nome);
    const [descricao, setDescricao] = useState(produto.descricao);
    const [preco, setPreco] = useState(produto.preco);
    const [quantidade, setQuantidade] = useState(produto.quantidade);
    const [image, setImage] = useState(produto.image);
    const user = location.state?.user || { id: 0, nome: '', email: '', senha: '', tipo: 'user' };

    useEffect(() => {
        if (user.id > 0) {
            setAdm(user.tipo === 'adm');
        } else {
            setAdm(false);
        }
    }, [user]);

    function nada(){}

    return (
        <div onClick={() => (vendoDetalhes? nada: setVendoDetalhes(true)) } className={vendoDetalhes ? 'produtoGrandao' : 'produtoNormal'}>
            <div className="img">
                <img className='imagem' src={image} alt="Imagem do produto" />
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
                                                value={image}
                                                 onChange={(e)=>setImage(e.target.value)}
                                                disabled={!isEditing} />
                                        </div>
                                    </>
                                }
                                
                            </section>
                            <section>
                                <div className="preco">
                                    <span className='precoFalso'>
                                        R$ 100,00
                                    </span>
                                    <input
                                        type='text'
                                        className="precoCerto"
                                        value={preco}
                                        onChange={(e)=>setPreco(e.target.value)}
                                        disabled={!isEditing}
                                    />
                                    
                                </div>
                                <button className='adicionar'>
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
                                        <button className="salvar">
                                            Salvar
                                        </button>
                                    }
                                    <button className="excluir">
                                        Excluir
                                    </button>
                                </div>
                            </>
                        }
                    </div>
                </>
            ) : (
                <h1>Produto</h1>
            )}
            
        </div>
    );
}

export default Product;
