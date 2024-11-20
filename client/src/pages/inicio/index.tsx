import './styles.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Product from '../../components/Product';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api';

function Home() {

    const location = useLocation();
    const[areAdm, setAreAdm] = useState(false);
    const user = location.state?.user || { id: 0, nome: '', email: '', senha: '', tipo: 'user' };

    useEffect(() => {
        if (user.id > 0) {
            setAreAdm(user.tipo === 'admin');
        } else {
            setAreAdm(false);
        }
    })

    return (
    <>
        <Header />
        <div id="content">
            <Product/>
        </div>
        <Footer />
    </>
    )
};

export default Home;