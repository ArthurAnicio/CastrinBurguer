import { useState, useEffect } from 'react';
import './styles.css'
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../api';

function Header() {
  const [isLogging, setIsLogging] = useState(false);
  const [tipo, setTipo] = useState('user');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state.user || {id: 0, nome: '', email:'', senha: '', tipo:'user'};

  useEffect(()=> {
    if (user.id > 0) {
      setIsLogging(true);
      setTipo(user.tipo);
    } else {
      setIsLogging(false);
      setTipo('user');
    }
  })

  async function login() {
    if (email && senha) {
      try {
        const response = await api.get(`/user?email=${email}&senha=${senha}`);
        if (response.status === 200) {
          navigate('/', { state: { user: response.data } });
        } else {
          alert('Email ou senha inválidos!');
        }
      } catch (err) {
        alert('Ocorreu um erro ao tentar logar!');
      }
    } else {
      alert('Por favor, preencha todos os campos!');
      return;
    }
  }

  return (
    <header className={tipo == 'adm'?'cabecarioAdm':''}>
      <img
        className='imagemHambuguer'
        src="https://cdn.discordapp.com/attachments/1005168389955797095/1306765076669272094/CastrinBurguer-Photoroom.png?ex=673c7890&is=673b2710&hm=e30679117fe41f8044583a42e3524e57b55692aa1d52b356be50e64eb17dacc6&"
        alt="Foto burguer"
      />
      {tipo == 'adm' && 
        <label className='modo'>
            Adm
            <i className="fa-solid fa-screwdriver-wrench"></i>
        </label>
      }
      <div className="usericon" onClick={() => setIsLogging(!isLogging)}>
        <i className="fa-solid fa-user"></i>
      </div>
      {isLogging && (
        <div className="dropdown">
          <h1>Bem Vindo</h1>
          <div className="campoform">
            <label>Login:</label>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="campoform">
            <label>Senha:</label>
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          <span className='fakelink'>
            Não tem uma conta?
            <span onClick={() => navigate('/criar-conta')}>
              Crie uma
            </span>
          </span>
          <button onClick={login}>Login</button>
        </div>
      )}
    </header>
  );
}

export default Header;
