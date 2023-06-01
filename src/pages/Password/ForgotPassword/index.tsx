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
  email: string;
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
          email: Yup.string().email('Formato de e-mail inválido').required('Email obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api
          .post<IFormData>('/passwords/forgot', {
            email: data.email,
          })
          .then(() => {
            addToast({
              type: 'success',
              title: 'Usuário',
              description: `Um token foi enviado para seu e-mail. Verifique as instruções para recriar a senha`,
            });

            history.push('/app/passwords/reset');
          })
          .catch(err => {
            addToast({
              type: 'error',
              title: 'Não foi possível solicitar a recriação da senha',
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
          <p>Informe o e-mail cadastrado. Você receberá um e-mail com instruções para recriar a senha</p>
          <Input name="email" type="text" placeholder="Email" />
          <Button name="login" isLoading={loading}>
            {loading ? 'enviando...' : 'Enviar'}
          </Button>
        </Form>
      </Content>
    </Background>
  );
};
export default ForgotPassword;
