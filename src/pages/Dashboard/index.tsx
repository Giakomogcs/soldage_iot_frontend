import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IoIosSquare } from 'react-icons/io';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { AiOutlineDashboard } from 'react-icons/ai';
import { GiElectric } from 'react-icons/gi';
import { format } from 'date-fns';
import { RiDashboardLine, RiDashboard2Line } from 'react-icons/ri';
import { Line, defaults } from 'react-chartjs-2';
import { lighten } from 'polished';
import api from '../../services/api';
import Layout from '../layout';
import Button from '../../components/Button';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';
import { Container, Content, Title, MainContent, ReadingBoard, ControlsContainer, Reading, TablePlotContainer } from './styles';
import getValidationErrors from '../../utils/getValidationsErrors';
import Input from '../../components/Input';
import Select from '../../components/Select';

interface IReadingsData {
  id: string;
  machine: IMachineData;
  welding_current: number;
  welding_voltage: number;
  arc_status: true;
  wire_speed: number;
  voltageL1: number;
  voltageL2: number;
  voltageL3: number;
  currentL1: number;
  currentL2: number;
  currentL3: number;
  input_power: number;
  gas_flow: number;
  created_at: Date;
}

interface IMachineData {
  id: string;
  client: IClientData;
  code: string;
  description: string;
}

interface IClientData {
  id: string;
  name: string;
}

interface IVariableData {
  name: string;
  leitura: string | number | boolean;
  moment: string;
}

interface IVariable {
  name: string;
  color: string;
  label: string;
  unit?: string;
}

interface IFilters {
  machine_id?: string;
  begin_date?: string;
  final_date?: string;
}

const Dashboard: React.FC = () => {
  const { token, user } = useAuth();
  const { addToast } = useToast();

  defaults.plugins.legend.display = false;
  defaults.animation = false;

  const formRef = useRef<FormHandles>(null);

  const [readingsList, setReadingsList] = useState<IReadingsData[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<string>('');
  const [selectedReading, setSelectedReading] = useState<IReadingsData>({} as IReadingsData);
  const [selectedVariable, setSelectedVariable] = useState<IVariable>({} as IVariable);
  const [clientsList, setClientsList] = useState<IClientData[]>([]);
  const [machinesList, setMachinesList] = useState<IMachineData[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [plotData, setPlotData] = useState<string[]>([]);
  const [plotLabels, setPlotLabels] = useState<string[]>([]);
  const [inputBeginValueDate, setInputBeginValueDate] = useState<string | undefined>(
    `${new Date(Date.now()).getFullYear()}-${
      new Date(Date.now()).getMonth() + 1 < 10 ? `0${new Date(Date.now()).getMonth() + 1}` : new Date(Date.now()).getMonth()
    }-${new Date(Date.now()).getDate()}T${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`,
  );

  const [inputEndValueDate, setInputEndValueDate] = useState<string | undefined>(
    `${new Date(Date.now()).getFullYear()}-${
      new Date(Date.now()).getMonth() + 1 < 10 ? `0${new Date(Date.now()).getMonth() + 1}` : new Date(Date.now()).getMonth()
    }-${new Date(Date.now()).getDate()}T${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`,
  );

  const [arcTotalTime, setArcTotalTime] = useState<number>(0);

  const fetchClients = useCallback(async () => {
    const { data } = await api.get<IClientData[]>('/users', { headers: { Authorization: `Bearer ${token}` } });
    setClientsList(data);
  }, [token]);

  const fetchMachines = useCallback(async () => {
    const { data } = await api.get<IMachineData[]>(user.isadmin ? '/machines' : `machines/client/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMachinesList(data);
  }, [token, user]);

  useEffect(() => {
    fetchClients();
    fetchMachines();

    if (!user.isadmin) {
      setSelectedClient(user.id);
    }
  }, [fetchClients, fetchMachines, user]);

  const handleSelectClient = (event: any): void => {
    setSelectedClient(event.target.value);
  };

  const machinesListByClient = useMemo(() => {
    return machinesList.filter(machine => machine.client.id === selectedClient);
  }, [selectedClient, machinesList]);

  useEffect(() => {
    api
      .get(user.isadmin ? '/readings' : `/readings/client/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        setReadingsList(response.data);
      })
      .catch(err => {
        addToast({
          title: 'Erro!',
          type: 'error',
          description: err.response ? `${err.response.data.message}` : `${err}`,
        });
      });
  });

  const tbodyToRender = useMemo(() => {
    const rows = readingsList.map(reading => {
      return (
        <tr
          key={reading.id}
          onClick={() => {
            setSelectedReading(reading);
            setSelectedMachine(reading.machine.id);
          }}
          className={selectedReading.id === reading.id ? 'selected' : ''}
        >
          <td>{reading.machine.code}</td>
          <td>{reading.machine.description}</td>
          <td>{reading.machine.client.name}</td>
          <td>{format(new Date(reading.created_at), 'dd/MM/yyyy HH:mm:ss')}</td>
        </tr>
      );
    });

    return rows;
  }, [readingsList, selectedReading]);

  useMemo(() => {
    const dataLabels: string[] = [];
    const dataPlot: string[] = [];
    const dataDates: Date[] = [];

    readingsList
      .slice(0)
      .reverse()
      .map(reading => {
        return Object.entries(reading).map(variable => {
          if (variable[0] === selectedVariable.name && selectedMachine === reading.machine.id) {
            dataLabels.push(format(new Date(reading.created_at), 'dd/MM/yyyy HH:mm:ss'));
            dataDates.push(new Date(reading.created_at));
            dataPlot.push(Number(variable[1]).toFixed(1));
          }
          return { ok: true };
        });
      });

    setPlotLabels(dataLabels);
    setPlotData(dataPlot);

    if (selectedVariable.name === 'arc_status') {
      let totalArcTime = 0;
      let arcBeginMoment: Date | undefined;
      let index = 0;

      dataPlot.map(arc_status => {
        if (arc_status === '1.0' && arcBeginMoment === undefined) {
          arcBeginMoment = dataDates[index];
        } else if (arc_status === '0.0' && arcBeginMoment !== undefined) {
          if (arcBeginMoment !== undefined) {
            totalArcTime += (dataDates[index].getTime() - arcBeginMoment.getTime()) / 1000;
            arcBeginMoment = undefined;
          }
        }

        index += 1;
      });

      setArcTotalTime(totalArcTime);
    }
  }, [readingsList, selectedVariable, selectedMachine]);

  const submitHandler = useCallback(
    async (data: IFilters) => {
      setSelectedReading({} as IReadingsData);
      setSelectedVariable({} as IVariable);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          machine_id: Yup.string().required('Máquina obrigatória'),
          begin_date: Yup.string().required('Data Inicial obrigatória'),
          final_date: Yup.string().required('Data Final obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const res = await api.get<IReadingsData[]>('/readings/filters', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            machine_id: data.machine_id,
            begin_date: data.begin_date,
            final_date: data.final_date,
          },
        });

        setReadingsList(res.data);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
        } else {
          addToast({
            type: 'error',
            title: 'Erro ao obter os dados',
            description: err.response ? `${err.response.data.message}` : `${err}`,
          });
        }
      }
      return { ok: true };
    },
    [addToast, token],
  );

  return (
    <Container>
      <Layout selectedItem="dashboard" />
      <Content>
        <Title>
          <RiDashboardLine />
          <p>Dashboard</p>
        </Title>

        <MainContent>
          <ControlsContainer>
            <Form ref={formRef} onSubmit={submitHandler}>
              {user.isadmin ? (
                <Select name="client_id" data={clientsList} selectedValue={selectedClient} onChange={e => handleSelectClient(e)} object="Cliente" />
              ) : (
                <h3>{user.name}</h3>
              )}

              <Select name="machine_id" data={machinesListByClient} object="Máquinas" />
              <Input
                name="begin_date"
                type="datetime-local"
                placeholder="Início"
                value={inputBeginValueDate}
                onClick={() => setInputBeginValueDate(undefined)}
              />
              <Input name="final_date" type="datetime-local" placeholder="Fim" value={inputEndValueDate} onClick={() => setInputEndValueDate(undefined)} />

              <Button>Filtrar</Button>
            </Form>
          </ControlsContainer>
          <ReadingBoard>
            <Reading
              onClick={() => setSelectedVariable({ name: 'voltageL1', color: '#4D9261', label: 'Tensão L1', unit: 'V' })}
              className={selectedVariable.name === 'voltageL1' ? 'selected' : ''}
            >
              <p>Tensão L1</p>
              <div>
                <GiElectric color="#4D9261" />
                <h2>
                  {selectedReading.voltageL1 ? Number(selectedReading.voltageL1).toFixed(1) : null}
                  <span>{selectedReading.voltageL1 ? ' V' : null}</span>
                </h2>
              </div>
            </Reading>
            <Reading
              onClick={() => setSelectedVariable({ name: 'voltageL2', color: '#0085D3', label: 'Tensão L2', unit: 'V' })}
              className={selectedVariable.name === 'voltageL2' ? 'selected' : ''}
            >
              <p>Tensão L2</p>
              <div>
                <GiElectric color="#0085D3" />
                <h2>
                  {selectedReading.voltageL2 ? Number(selectedReading.voltageL2).toFixed(1) : null}
                  <span>{selectedReading.voltageL2 ? ' V' : null}</span>
                </h2>
              </div>
            </Reading>
            <Reading
              onClick={() => setSelectedVariable({ name: 'voltageL3', color: '#46BBC5', label: 'Tensão L3', unit: 'V' })}
              className={selectedVariable.name === 'voltageL3' ? 'selected' : ''}
            >
              <p>Tensão L3</p>
              <div>
                <GiElectric color="#46BBC5" />
                <h2>
                  {selectedReading.voltageL3 ? Number(selectedReading.voltageL3).toFixed(1) : null}
                  <span>{selectedReading.voltageL3 ? ' V' : null}</span>
                </h2>
              </div>
            </Reading>
            <Reading
              onClick={() => setSelectedVariable({ name: 'currentL1', color: '#14E545', label: 'Corrente L1', unit: 'A' })}
              className={selectedVariable.name === 'currentL1' ? 'selected' : ''}
            >
              <p>Corrente L1</p>
              <div>
                <GiElectric color="#14E545" />
                <h2>
                  {selectedReading.currentL1 ? Number(selectedReading.currentL1).toFixed(1) : null}
                  <span>{selectedReading.currentL1 ? ' A' : null}</span>
                </h2>
              </div>
            </Reading>
            <Reading
              onClick={() => setSelectedVariable({ name: 'currentL2', color: '#1F74BC', label: 'Corrente L2', unit: 'A' })}
              className={selectedVariable.name === 'currentL2' ? 'selected' : ''}
            >
              <p>Corrente L2</p>
              <div>
                <GiElectric color="#1F74BC" />
                <h2>
                  {selectedReading.currentL2 ? Number(selectedReading.currentL2).toFixed(1) : null}
                  <span>{selectedReading.currentL2 ? ' A' : null}</span>
                </h2>
              </div>
            </Reading>
            <Reading
              onClick={() => setSelectedVariable({ name: 'currentL3', color: '#f8e809', label: 'Corrente L3', unit: 'A' })}
              className={selectedVariable.name === 'currentL3' ? 'selected' : ''}
            >
              <p>Corrente L3</p>
              <div>
                <GiElectric color="#f8e809" />
                <h2>
                  {selectedReading.currentL3 ? Number(selectedReading.currentL3).toFixed(1) : null}
                  <span>{selectedReading.currentL3 ? ' A' : null}</span>
                </h2>
              </div>
            </Reading>
            <Reading
              onClick={() => setSelectedVariable({ name: 'input_power', color: '#1A1818', label: 'Potência de Entrada', unit: 'Kva/h' })}
              className={selectedVariable.name === 'input_power' ? 'selected' : ''}
            >
              <p>Potência de Entrada</p>
              <div>
                <GiElectric color="#1A1818" />
                <h2>
                  {selectedReading.input_power ? Number(selectedReading.input_power).toFixed(1) : null}
                  <span>{selectedReading.input_power ? ' Kva/h' : null}</span>
                </h2>
              </div>
            </Reading>
            <Reading
              onClick={() => setSelectedVariable({ name: 'gas_flow', color: '#E56B14', label: 'Fluxo de Gás', unit: 'm³' })}
              className={selectedVariable.name === 'gas_flow' ? 'selected' : ''}
            >
              <p>Fluxo de Gás</p>
              <div>
                <AiOutlineDashboard color="#E56B14" />
                <h2>
                  {selectedReading.gas_flow ? Number(selectedReading.gas_flow).toFixed(1) : null}
                  <span>{selectedReading.gas_flow ? ' m³' : null}</span>
                </h2>
              </div>
            </Reading>
            <Reading
              onClick={() => setSelectedVariable({ name: 'arc_status', color: '#000', label: 'Status do Arco' })}
              className={selectedVariable.name === 'arc_status' ? 'selected' : ''}
            >
              <p>Status do Arco</p>
              <div>
                <IoIosSquare color={selectedReading.arc_status === undefined ? 'white' : selectedReading.arc_status ? 'lime' : 'red'} />
                <h2>{selectedReading.arc_status === undefined ? null : selectedReading.arc_status ? 'Ligado' : 'Desligado'}</h2>
              </div>
            </Reading>
            <Reading
              onClick={() => setSelectedVariable({ name: 'welding_current', color: '#E4003F', label: 'Corrente de Solda', unit: 'A' })}
              className={selectedVariable.name === 'welding_current' ? 'selected' : ''}
            >
              <p>Corrente de Solda</p>
              <div>
                <GiElectric color="#E4003F" />
                <h2>
                  {selectedReading.welding_current ? Number(selectedReading.welding_current).toFixed(1) : null}
                  <span>{selectedReading.welding_current ? ' A' : null}</span>
                </h2>
              </div>
            </Reading>
            <Reading
              onClick={() => setSelectedVariable({ name: 'welding_voltage', color: '#987757', label: 'Tensão de Solda', unit: 'V' })}
              className={selectedVariable.name === 'welding_voltage' ? 'selected' : ''}
            >
              <p>Tensão de Solda</p>
              <div>
                <GiElectric color="#987757" />
                <h2>
                  {selectedReading.welding_voltage ? Number(selectedReading.welding_voltage).toFixed(1) : null}
                  <span>{selectedReading.welding_voltage ? ' V' : null}</span>
                </h2>
              </div>
            </Reading>
            <Reading
              onClick={() => setSelectedVariable({ name: 'wire_speed', color: '#6E0095', label: 'Velocidade do Arame', unit: '%' })}
              className={selectedVariable.name === 'wire_speed' ? 'selected' : ''}
            >
              <p>Velocidade do Arame</p>
              <div>
                <RiDashboard2Line color="#6E0095" />
                <h2>
                  {selectedReading.wire_speed ? Number(selectedReading.wire_speed).toFixed(1) : null}
                  <span>{selectedReading.wire_speed ? '%' : null}</span>
                </h2>
              </div>
            </Reading>
          </ReadingBoard>

          <TablePlotContainer>
            <div className="tableContainer">
              <table>
                <thead>
                  <tr>
                    <th colSpan={2}>Máquina</th>
                    <th>Cliente</th>
                    <th>Momento</th>
                  </tr>
                </thead>
                <tbody>{tbodyToRender}</tbody>
              </table>
            </div>

            <div className="plotContainer">
              <h2>
                <span>{selectedReading.machine !== undefined ? selectedReading.machine.code : null}</span>
                {selectedReading.machine !== undefined ? ` - ${selectedReading.machine.description}` : null}
              </h2>
              {selectedVariable.name === 'arc_status' ? (
                <h3>
                  Tempo Total Abertura do Arco:
                  <span className="arcTime">{` ${new Date(+parseFloat(arcTotalTime.toString()).toFixed(0) * 1000).toISOString().substr(11, 8)}`}</span>
                </h3>
              ) : (
                <h3>
                  {selectedVariable.name !== undefined ? selectedVariable.label : null}
                  <span>{selectedVariable.unit !== undefined ? ` (${selectedVariable.unit})` : null}</span>
                </h3>
              )}

              <div>
                <Line
                  type="line"
                  data={{
                    labels: plotLabels,
                    datasets: [
                      {
                        data: plotData,
                        label: selectedVariable.label,
                        borderColor: selectedVariable.color,
                        fill: true,
                        backgroundColor: lighten(0.4, selectedVariable.color ? selectedVariable.color : '#fff'),
                        tension: 0.05,
                      },
                    ],
                  }}
                />
              </div>
            </div>
          </TablePlotContainer>
        </MainContent>
      </Content>
    </Container>
  );
};

export default Dashboard;
