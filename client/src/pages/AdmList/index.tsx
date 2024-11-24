import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './styles.css';
import api from "../../api"; 
import Header from '../../components/Header';

interface User {
  id: number;
  nome: string;
  email: string;
  tipo: string;
}

//----ÚNICA PÁGINA FEITA PELO KATATAU----//

function AdmList() {
  const [users, setUsers] = useState<User[]>([]);
  const [userTypes, setUserTypes] = useState<{ [key: number]: string }>({});
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user || { id: 0, nome: "", tipo: "user" };

  useEffect(() => {
    if (user.tipo !== "adm") {
      alert("Acesso negado! Apenas administradores podem visualizar esta página.");
      navigate("/");
    }
  }, [navigate, user]);

  useEffect(() => {
    if (user.tipo === "adm") {

      api.get("/all-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        }
      })
      .then((response) => {
        console.log("Resposta da API:", response);
        setUsers(response.data);
      
        const initialUserTypes = response.data.reduce((acc: { [key: number]: string }, user: User) => {
          acc[user.id] = user.tipo;
          return acc;
        }, {});
        setUserTypes(initialUserTypes);
      })
      .catch((err) => {
        console.error("Erro ao buscar usuários:", err);
      });
    }
  }, [user]);

  const handleTypeChange = (userId: number, newType: string) => {
    setUserTypes((prevState) => ({
      ...prevState,
      [userId]: newType, 
    }));
  };

  const changeUserType = async (userId: number) => {
    const newType = userTypes[userId];
    if (!newType) {
      alert("Por favor, selecione um tipo de usuário.");
      return;
    }
  
    try {
      const response = await api.put(`/user`, { id: userId, tipo: newType }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      console.log("Tipo de usuário alterado:", response.data.message);
  
      setUsers(users.map(user => 
        user.id === userId ? { ...user, tipo: newType } : user
      ));
    } catch (err) {
      console.error("Erro ao alterar tipo:", err.response?.data?.error || err);
    }
  };

  const deleteUser = async (userId: number) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este usuário?");
    if (!confirmDelete) return;
  
    try {
      const response = await api.delete(`/user`, {
        params: { id: userId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      console.log("Usuário excluído:", response.data.message);
  
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      console.error("Erro ao excluir usuário:", err.response?.data?.error || err);
    }
  };

  return (
    <>
      <Header />
      <div className="listaUsuarios">
        <h1>Lista de Usuários</h1>
        <ul>
          {users.length === 0 ? (
            <p>Nenhum usuário encontrado.</p>
          ) : (
            users.map((user) => (
              <li key={user.id}>
                <div className="usuarioInfo">
                  <span>{user.nome} - {user.email} - {user.tipo}</span>
                  <select 
                    value={userTypes[user.id] || ''} 
                    onChange={(e) => handleTypeChange(user.id, e.target.value)} 
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="adm">Administrador</option>
                    <option value="user">Usuário</option>
                  </select>
                </div>
                <button onClick={() => changeUserType(user.id)}>Alterar Tipo</button>
                <button onClick={() => deleteUser(user.id)}>Excluir</button>
              </li>
            ))
          )}
        </ul>
        <button onClick={() => navigate("/",{state: {user}})}>Voltar</button>
      </div>
    </>
  );
}

export default AdmList;
