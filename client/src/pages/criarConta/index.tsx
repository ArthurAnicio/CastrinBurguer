import Footer from '../../components/Footer';
import Header from '../../components/Header';
import api from '../../api';
import './styles.css';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function SignUp() {

    const navigate = useNavigate();
    const location = useLocation();
    const[nome, setNome]=useState('');
    const[email, setEmail]=useState('');
    const[senha, setSenha]=useState('');
    const tipo = 'user'

    async function signUp(){
        if(nome && email && senha){
            try{
                const response = await api.post('/user', { nome, email, senha, tipo });
                if(response.status === 201){
                    alert('Conta criada com sucesso!');
                    navigate('/', { state: { user: response.data } });
                } else {
                    alert('Ocorreu um erro ao tentar cadastrar a conta!');
                }
            } catch(error){
                console.error(error);
                alert('Ocorreu um erro ao tentar cadastrar a conta!');
            }
        } else {
            alert('Todos os campos são obrigatórios!');
        }
    }

    return (
    <>
        <Header />
        <div id="content">
            <div className="signUpForm">
                <h2>Criar Conta</h2>
                <form>
                    <div className="campoForm">
                        <label>Nome:</label>
                        <input 
                            type="text" 
                            value={nome}
                            onChange={(e) => setNome(e.target.value)} 
                        />
                    </div>
                    <div className="campoForm">
                        <label >Email:</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="campoForm">
                        <label >Senha:</label>
                        <input 
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)} 
                        />
                    </div>
                    <button type="submit" onClick={signUp}>Cadastrar</button>
                </form>
            </div>
        </div>
        <Footer />
    </>
    )
};

export default SignUp;