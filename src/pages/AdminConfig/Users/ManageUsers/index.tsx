import React, { useRef, useCallback, useEffect, useState } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { FiUser } from 'react-icons/fi';
import { MdDone } from 'react-icons/md';
import { CgClose } from 'react-icons/cg';
import { useHistory, useParams } from 'react-router-dom';
import api from '../../../../services/api';
import Layout from '../../../layout';
import getValidationErrors from '../../../../utils/getValidationsErrors';
import Button from '../../../../components/Button';
import Input from '../../../../components/Input';
import { useToast } from '../../../../hooks/toast';
import { useAuth } from '../../../../hooks/auth';

import { Container, Content, Title, MainContent, ControlBar, Controls, CheckGroup } from './styles';

interface IUserFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  inactive?: boolean;
  isadmin?: boolean;
}

interface IUserData {
  name: string;
  email: string;
  password: string;
  inactive: boolean;
}

interface IRequestParam {
  user_id: string;
}

const ManageUsers: React.FC = () => {
  const { user_id } = useParams() as IRequestParam;

  const editMode = !!user_id;

  const { token } = useAuth();

  const formRef = useRef<FormHandles>(null);
  const [isInactive, setIsInactive] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUserData = useCallback(async () => {
    const { data } = await api.get<IUserFormData>(`/users/${user_id}`, { headers: { Authorization: `Bearer ${token}` } });

    formRef.current?.setData(data);
    setIsInactive(data.inactive ? data.inactive : false);
    setIsAdmin(data.isadmin ? data.isadmin : false);
  }, [user_id, token]);

  const { addToast } = useToast();

  const history = useHistory();

  const submitHandler = useCallback(
    async (data: IUserFormData) => {
      setLoading(true);
      try {
        formRef.current?.setErrors({});

        let schema;

        if (editMode) {
          schema = Yup.object().shape({
            name: Yup.string().required('Nome obrigatório'),
            email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
          });
        } else {
          schema = Yup.object().shape({
            name: Yup.string().required('Nome obrigatório'),
            email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
            password: Yup.string().required('Senha obrigatória'),
            confirmPassword: Yup.string()
              .required('Confirmação de senha obrigatória')
              .oneOf([Yup.ref('password')], 'Senha e confirmação devem ser iguais'),
          });
        }

        await schema.validate(data, {
          abortEarly: false,
        });

        if (editMode) {
          const res = await api.put<IUserData>(
            `/users/${user_id}`,
            {
              name: data.name,
              email: data.email,
              inactive: isInactive,
            },
            { headers: { Authorization: `Bearer ${token}` } },
          );

          addToast({
            type: 'success',
            title: 'Usuário',
            description: `Usuário ${res.data.name} foi alterado.`,
          });
        } else {
          const res = await api.post<IUserData>(
            '/users',
            {
              name: data.name,
              email: data.email,
              password: data.password,
            },
            { headers: { Authorization: `Bearer ${token}` } },
          );

          addToast({
            type: 'success',
            title: 'Usuário',
            description: `Usuário ${res.data.name} foi adicionado.`,
          });
        }

        setLoading(false);

        return history.push('/app/users');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
        } else {
          addToast({
            type: 'error',
            title: 'Não foi possível adicionar usuário',
            description: err.response ? `${err.response.data.message}` : `${err}`,
          });
        }
        setLoading(false);
      }
      return { ok: true };
    },
    [addToast, history, token, editMode, user_id, isInactive],
  );

  useEffect(() => {
    if (user_id) {
      fetchUserData();
    }
  }, [fetchUserData, user_id]);

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
            <div>{editMode ? <p>Alterar usuário</p> : <p>Criar usuário</p>}</div>
            <Controls>
              <Button name="cancel" onClick={() => history.push('/app/users')}>
                <CgClose />
                Cancelar
              </Button>

              <Button name="save" form="form" isLoading={loading}>
                <MdDone />
                {loading ? 'salvando...' : 'Salvar'}
              </Button>
            </Controls>
          </ControlBar>
          <hr />
          <Form id="form" ref={formRef} onSubmit={submitHandler}>
            <Input name="name" type="text" placeholder="Nome" />
            <Input name="email" type="text" placeholder="Email" />

            {editMode && !isAdmin && (
              <CheckGroup>
                <input
                  name="inactive"
                  type="checkbox"
                  placeholder="Inativo"
                  onChange={() => setIsInactive(!isInactive)}
                  defaultChecked={isInactive}
                  checked={isInactive}
                />
                <h3>Inativo</h3>
              </CheckGroup>
            )}

            {!editMode && (
              <>
                <Input name="password" type="password" placeholder="Senha" />
                <Input name="confirmPassword" type="password" placeholder="Confirmação de senha" />
              </>
            )}
          </Form>
        </MainContent>
      </Content>
    </Container>
  );
};

export default ManageUsers;
