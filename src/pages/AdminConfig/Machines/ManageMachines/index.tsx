import React, { useRef, useCallback, useEffect, useState } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { FiSettings } from 'react-icons/fi';
import { MdDone } from 'react-icons/md';
import { CgClose } from 'react-icons/cg';
import { useHistory, useParams } from 'react-router-dom';
import Select from '../../../../components/Select';
import api from '../../../../services/api';
import Layout from '../../../layout';
import getValidationErrors from '../../../../utils/getValidationsErrors';
import Button from '../../../../components/Button';
import Input from '../../../../components/Input';
import { useToast } from '../../../../hooks/toast';
import { useAuth } from '../../../../hooks/auth';

import { Container, Content, Title, MainContent, ControlBar, Controls } from './styles';

interface IMachineFormData {
  client_id: string;
  code: string;
  description: string;
  mac_address: string;
  client?: IClientData;
}

interface IClientData {
  id: string;
  name: string;
}

interface IRequestParam {
  machine_id: string;
}

const ManageMachines: React.FC = () => {
  const { machine_id } = useParams() as IRequestParam;

  const editMode = !!machine_id;

  const { token } = useAuth();

  const formRef = useRef<FormHandles>(null);

  const [clientsList, setClientsList] = useState<IClientData[]>([]);
  const [machineClient, setmachineClient] = useState<IClientData>({} as IClientData);
  const [loading, setLoading] = useState(false);

  const fetchClients = useCallback(async () => {
    const { data } = await api.get<IClientData[]>('/users/active', { headers: { Authorization: `Bearer ${token}` } });

    setClientsList(data);
  }, [token]);

  const fetchMachineData = useCallback(async () => {
    const { data } = await api.get<IMachineFormData>(`/machines/${machine_id}`, { headers: { Authorization: `Bearer ${token}` } });

    formRef.current?.setData(data);
    setmachineClient(data.client ? data.client : ({} as IClientData));
  }, [machine_id, token, setmachineClient]);

  const { addToast } = useToast();

  const history = useHistory();

  const submitHandler = useCallback(
    async (data: IMachineFormData) => {
      setLoading(true);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          client_id: Yup.string().required('Cliente obrigatório'),
          code: Yup.string().required('Código obrigatório'),
          description: Yup.string().required('Descrição obrigatória'),
          mac_address: Yup.string().required('Endereço mac obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        if (editMode) {
          const res = await api.put<IMachineFormData>(
            `/machines/${machine_id}`,
            {
              client_id: data.client_id,
              code: data.code,
              description: data.description,
              mac_address: data.mac_address,
            },
            { headers: { Authorization: `Bearer ${token}` } },
          );

          addToast({
            type: 'success',
            title: 'Máquina',
            description: `Máquina ${res.data.description} foi alterada.`,
          });
        } else {
          const res = await api.post<IMachineFormData>(
            '/machines',
            {
              client_id: data.client_id,
              code: data.code,
              description: data.description,
              mac_address: data.mac_address,
            },
            { headers: { Authorization: `Bearer ${token}` } },
          );

          addToast({
            type: 'success',
            title: 'Máquina',
            description: `Máquina ${res.data.description} foi adicionada.`,
          });
        }
        setLoading(false);
        return history.push('/app/machines');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
        } else {
          addToast({
            type: 'error',
            title: 'Não foi possível adicionar a máquina',
            description: err.response ? `${err.response.data.message}` : `${err}`,
          });
        }
        setLoading(false);
      }
      return { ok: true };
    },
    [addToast, history, token, editMode, machine_id],
  );

  useEffect(() => {
    if (machine_id) {
      fetchMachineData();
    }

    fetchClients();
  }, [fetchMachineData, machine_id, fetchClients]);

  return (
    <Container>
      <Layout selectedItem="machines" />
      <Content>
        <Title>
          <FiSettings />
          <p>Máquinas</p>
        </Title>

        <MainContent>
          <ControlBar>
            <div>{editMode ? <p>Alterar máquina</p> : <p>Criar máquina</p>}</div>
            <Controls>
              <Button name="cancel" onClick={() => history.push('/app/machines')}>
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
            <Select name="client_id" data={clientsList} selectedValue={machineClient.id} object="cliente" />
            <Input name="code" type="text" placeholder="Código" />
            <Input name="description" type="text" placeholder="Descrição" />
            <Input name="mac_address" type="text" placeholder="Endereço Mac" />
          </Form>
        </MainContent>
      </Content>
    </Container>
  );
};

export default ManageMachines;
