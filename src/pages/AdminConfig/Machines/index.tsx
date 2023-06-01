import React, { useEffect, useMemo, useState } from 'react';
import { FiSettings, FiPlusSquare, FiEdit } from 'react-icons/fi';
import { format } from 'date-fns';
import { useHistory } from 'react-router-dom';
import api from '../../../services/api';
import Layout from '../../layout';
import Button from '../../../components/Button';
import { useToast } from '../../../hooks/toast';
import { useAuth } from '../../../hooks/auth';
import { Container, Content, Title, MainContent, ControlBar, Controls } from './styles';

interface IMachineData {
  id: string;
  code: string;
  description: string;
  client: IClientData;
  mac_address: string;
  created_at: string;
}

interface IClientData {
  name: string;
}

const Machines: React.FC = () => {
  const { token } = useAuth();

  const { addToast } = useToast();

  const history = useHistory();

  const [machinesList, setMachinesList] = useState<IMachineData[]>([]);
  const [machineToEdit, setMachineToEdit] = useState<IMachineData>({} as IMachineData);
  const [machineFilter, setMachineFilter] = useState<string>();

  useEffect(() => {
    api
      .get('/machines', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        setMachinesList(response.data);
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
    const rows = machinesList.map(machine => {
      if (machineFilter) {
        if (
          machine.code.toLowerCase().includes(machineFilter.toLowerCase()) ||
          machine.description.toLowerCase().includes(machineFilter.toLowerCase()) ||
          machine.client.name.toLowerCase().includes(machineFilter.toLowerCase()) ||
          machine.mac_address.toLowerCase().includes(machineFilter.toLowerCase())
        ) {
          return (
            <tr key={machine.id} onClick={() => setMachineToEdit(machine)} className={machineToEdit.id === machine.id ? 'selected' : ''}>
              <td>{machine.code}</td>
              <td>{machine.description}</td>
              <td>{machine.client.name}</td>
              <td>{machine.mac_address}</td>
              <td>{format(new Date(machine.created_at), 'dd/MM/yyyy HH:mm')}</td>
            </tr>
          );
        }

        return null;
      }
      return (
        <tr key={machine.id} onClick={() => setMachineToEdit(machine)} className={machineToEdit.id === machine.id ? 'selected' : ''}>
          <td>{machine.code}</td>
          <td>{machine.description}</td>
          <td>{machine.client.name}</td>
          <td>{machine.mac_address}</td>
          <td>{format(new Date(machine.created_at), 'dd/MM/yyyy HH:mm')}</td>
        </tr>
      );
    });

    return rows;
  }, [machinesList, setMachineToEdit, machineToEdit, machineFilter]);

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
            <div>
              <input onChange={event => setMachineFilter(event.target.value)} placeholder="Buscar na lista" />
            </div>
            <Controls>
              <Button
                name="editButton"
                className={!machineToEdit.id ? 'disabled' : ''}
                onClick={() => {
                  history.push(`/app/machines/manage/${machineToEdit.id}`);
                }}
              >
                <FiEdit />
                Alterar
              </Button>
              <Button
                name="newButton"
                onClick={() => {
                  history.push('/app/machines/manage');
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
                  <th>Código</th>
                  <th>Descrição</th>
                  <th>Cliente</th>
                  <th>Endereço Mac</th>
                  <th>Data de Criação</th>
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

export default Machines;
