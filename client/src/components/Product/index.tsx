import './styles.css';
import api from '../../api';
import { useState } from 'react';

function Product() {

    const[vendoDetalhes, setVendoDetalhes] = useState(false);

    return (
        <div  onClick={() => setVendoDetalhes(!vendoDetalhes)} className={vendoDetalhes?'produtoGrandao':'produtoNormal'}>
            <div className="img"></div>
            <h1>Produto</h1>
        </div>
    )
};

export default Product;