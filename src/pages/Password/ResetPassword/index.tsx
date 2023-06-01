import React, { useRef, useCallback, useState } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import getValidationErrors from '../../../utils/getValidationsErrors';
import { useToast } from '../../../hooks/toast';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import logo from '../../../assets/logo.png';
import { Background, Content } from './styles';
import api from '../../../services/api';

interface IFormData {
  token: string;
  password: string;
  password_confirmation: string;
}

const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const submitHandler = useCallback(
    async (data: IFormData) => {
      setLoading(true);
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          token: Yup.string().required('Token obrigatório'),
          password: Yup.string().required('Senha obrigatória'),
          password_confirmation: Yup.string()
            .required('Confirmação de senha obrigatória')
            .oneOf([Yup.ref('password')], 'Senha e confirmação devem ser iguais'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api
          .post<IFormData>('/passwords/reset', {
            token: data.token,
            password: data.password,
            password_confirmation: data.password_confirmation,
          })
          .then(() => {
            addToast({
              type: 'success',
              title: 'Usuário',
              description: `A senha foi recriada`,
            });

            history.push('/app');
          })
          .catch(err => {
            addToast({
              type: 'error',
              title: 'Não foi possível recriar a senha',
              description: err.response ? `${err.response.data.message}` : `${err}`,
            });
          });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          return formRef.current?.setErrors(errors);
        }

        return addToast({
          type: 'error',
          title: 'Não foi possível recriar a senha',
          description: error.response ? `${error.response.data.message}` : `${error}`,
        });
      } finally {
        setLoading(false);
      }
      return { ok: true };
    },
    [addToast, history],
  );

  return (
    <Background>
      <Content>
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>

        <Form ref={formRef} onSubmit={submitHandler}>
          <p>Um token foi enviado para o email cadastrado. Copie-o e cole no campo correspondente. Informe uma nova senha para que seja recriada</p>
          <Input name="token" type="text" placeholder="Token" />
          <Input name="password" type="password" placeholder="Senha" />
          <Input name="password_confirmation" type="password" placeholder="Senha" />
          <Button name="login" isLoading={loading}>
            {loading ? 'enviando...' : 'Enviar'}
          </Button>
        </Form>
      </Content>
    </Background>
  );
};
export default ForgotPassword;
