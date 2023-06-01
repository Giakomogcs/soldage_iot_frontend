import React, { useRef, useCallback, useState } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import getValidationErrors from '../../utils/getValidationsErrors';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

import Button from '../../components/Button';
import Input from '../../components/Input';

import logo from '../../assets/logo.png';

import { Background, Content } from './styles';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();

  const { addToast } = useToast();
  const { signIn } = useAuth();

  const [loading, setLoading] = useState(false);

  const submitHandler = useCallback(
    async (data: SignInFormData) => {
      setLoading(true);
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
          password: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({ email: data.email, password: data.password });

        return history.push('/app/dashboard');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          return formRef.current?.setErrors(errors);
        }

        return addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: error.response ? `${error.response.data.message}` : `${error}`,
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast, signIn, history],
  );

  return (
    <Background>
      <Content>
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <Form ref={formRef} onSubmit={submitHandler}>
          <Input name="email" type="text" placeholder="Email" />
          <Input name="password" type="password" placeholder="Senha" />
          <Button name="login" isLoading={loading}>
            {loading ? 'autenticando...' : 'ENTRAR'}
          </Button>
        </Form>
        <Link to="/app/passwords/forgot">Esqueci/quero alterar a senha</Link>
      </Content>
    </Background>
  );
};
export default SignIn;
