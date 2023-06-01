import React, { useEffect, useMemo, useState } from 'react';
import { FiUser, FiPlusSquare, FiEdit } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import api from '../../../services/api';
import Layout from '../../layout';
import Button from '../../../components/Button';
import { useToast } from '../../../hooks/toast';
import { useAuth } from '../../../hooks/auth';
import { Container, Content, Title, MainContent, ControlBar, Controls } from './styles';

interface IUserData {
  id: string;
  name: string;
  email: string;
  isadmin: string;
  inactive: boolean;
}

const Users: React.FC = () => {
  const { token } = useAuth();

  const { addToast } = useToast();

  const history = useHistory();

  const [usersList, setUsersList] = useState<IUserData[]>([]);
  const [userToEdit, setUserToEdit] = useState<IUserData>({} as IUserData);
  const [userFilter, setUserFilter] = useState<string>();

  useEffect(() => {
    api
      .get('/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        setUsersList(response.data);
      })
      .catch(err => {
        addToast({
          title: 'Erro!',
          type: 'error',
          description: err.response ? `${err.response.data.message}` : `${err}`,
        });
      });
  }, [addToast, token]);

  const tbodyToRender = useMemo(() => {
    const rows = usersList.map(user => {
      if (userFilter) {
        if (
          user.name.toLowerCase().includes(userFilter.toLowerCase()) ||
          user.email.toLowerCase().includes(userFilter.toLowerCase()) ||
          (user.isadmin ? 'Administrador' : 'Cliente').toLowerCase().includes(userFilter.toLowerCase())
        ) {
          return (
            <tr
              key={user.id}
              onClick={() => setUserToEdit(user)}
              className={`${user.inactive} ? 'inactive' : '' ${userToEdit.id === user.id} ?  'selected' : ''`}
            >
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.isadmin ? 'Administrador' : 'Cliente'}</td>
              <td className={user.inactive ? 'inactive' : ''}>{user.inactive ? 'Inativo' : 'Ativo'}</td>
            </tr>
          );
        }

        return null;
      }
      return (
        <tr key={user.id} onClick={() => setUserToEdit(user)} className={userToEdit.id === user.id ? 'selected' : ''}>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>{user.isadmin ? 'Administrador' : 'Cliente'}</td>
          <td className={user.inactive ? 'inactive' : ''}>{user.inactive ? 'Inativo' : 'Ativo'}</td>
        </tr>
      );
    });

    return rows;
  }, [usersList, setUserToEdit, userToEdit, userFilter]);

  return (
    <Container>
      <Layout selectedItem="users" />
      <Content>
        <Title>
          <FiUser />
          <p>Usuários</p>
        </Title>

        <MainContent>
          <ControlBar>
            <div>
              <input onChange={event => setUserFilter(event.target.value)} placeholder="Buscar na lista" />
            </div>
            <Controls>
              <Button
                name="editButton"
                className={!userToEdit.id ? 'disabled' : ''}
                onClick={() => {
                  history.push(`/app/users/manage/${userToEdit.id}`);
                }}
              >
                <FiEdit />
                Alterar
              </Button>
              <Button
                name="newButton"
                onClick={() => {
                  history.push('/app/users/manage');
                }}
              >
                <FiPlusSquare />
                Novo
              </Button>
            </Controls>
          </ControlBar>

          <div className="tableContainer">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Tipo</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>{tbodyToRender}</tbody>
            </table>
          </div>
        </MainContent>
      </Content>
    </Container>
  );
};

export default Users;
