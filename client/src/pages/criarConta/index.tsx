import Footer from '../../components/Footer';
import Header from '../../components/Header';
import api from '../../api';
import './styles.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {

    const navigate = useNavigate();
    const[nome, setNome]=useState('');
    const[email, setEmail]=useState('');
    const[senha, setSenha]=useState('');
    const tipo = 'user'

    async function signUp(){
        if(nome && email && senha){
            try{
                const response = await api.post('/user', { nome, email, senha, tipo });
                console.log(response)
                if(response.status === 200){
                    alert('Conta criada com sucesso!');
                    navigate('/', { state: { user: response.data } });
                } else {
                    alert(response.data.error);;
                }
            } catch(err){
                alert('Erro ao cadastrar sua conta');
                console.log(err);
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
                <nav>
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
                            type="text" 
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
                    <button onClick={signUp}>Cadastrar</button>
                </nav>
            </div>
        </div>
        <Footer />
    </>
    )
};

export default SignUp;