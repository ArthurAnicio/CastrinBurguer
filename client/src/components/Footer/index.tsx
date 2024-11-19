import { useLocation } from 'react-router-dom';
import './styles.css'
import { useEffect, useState } from 'react';

function Footer(){

    const [tipo, setTipo] = useState('user');
    const location = useLocation();
    const user = location.state?.user || { id: 0, nome: '', email: '', senha: '', tipo: 'user' };
    
    useEffect(() => {
        if (user.id > 0) {
          setTipo(user.tipo);
        } else {
          setTipo('user');
        }
      }, [user]);

    return(
        <footer className={tipo == 'adm'?'rodapeAdm':''}>
            Feito por <span>A&A inc</span> 
        </footer>
    )
}

export default Footer;