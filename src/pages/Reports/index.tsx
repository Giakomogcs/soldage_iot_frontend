import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormHandles } from '@unform/core';
import ReactDOMServer from 'react-dom/server';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { AiOutlineFileDone } from 'react-icons/ai';
import { defaults, Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { lighten } from 'polished';
import api from '../../services/api';
import Layout from '../layout';
import Button from '../../components/Button';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';
import { Container, Content, Title, MainContent, VariablesContainer, ControlsContainer, TablePlotContainer } from './styles';
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

const Reports: React.FC = () => {
  const { token, user } = useAuth();
  const { addToast } = useToast();

  defaults.plugins.legend.display = false;

  const formRef = useRef<FormHandles>(null);

  const [readingsList, setReadingsList] = useState<IReadingsData[]>([]);
  const [selectedVariables, setSelectedVariables] = useState<IVariable[]>([]);
  const [clientsList, setClientsList] = useState<IClientData[]>([]);
  const [machinesList, setMachinesList] = useState<IMachineData[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
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

  const [loading, setLoading] = useState(false);
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

  const reportToRender = useMemo(() => {
    return (
      <div>
        {selectedVariables.map(variable => {
          const dataLabels: string[] = [];
          const dataPlot: string[] = [];
          const dataDates: Date[] = [];

          readingsList
            .slice(0)
            .reverse()
            .map(reading => {
              return Object.entries(reading).map(object => {
                if (object[0] === variable.name) {
                  dataLabels.push(format(new Date(reading.created_at), 'dd/MM/yyyy HH:mm:ss'));
                  dataDates.push(new Date(reading.created_at));
                  dataPlot.push(Number(object[1]).toFixed(1));
                }
                return { ok: true };
              });
            });

          if (variable.name === 'arc_status') {
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

          return (
            <TablePlotContainer key={variable.name}>
              <div className="tableContainer">
                <table id={`table_${selectedVariables.indexOf(variable)}`}>
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Máquina</th>
                      <th>Variável</th>
                      <th>Leitura</th>
                    </tr>
                  </thead>
                  <tbody>
                    {readingsList.map(reading => (
                      <tr key={reading.id}>
                        <td>{format(new Date(reading.created_at), 'dd/MM/yyyy HH:mm:ss')}</td>
                        <td>{reading.machine?.description}</td>
                        <td>{variable.label}</td>
                        <td>
                          {Object.entries(reading).map((object): string | undefined => {
                            if (object[0] === variable.name) {
                              return Number(object[1]).toFixed(1);
                            }

                            return undefined;
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="plotContainer">
                <h2>
                  <span>{readingsList[0].machine.description}</span>
                </h2>
                {variable.name === 'arc_status' ? (
                  <h3>
                    Tempo Total Abertura do Arco:
                    <span className="arcTime">{` ${new Date(+parseFloat(arcTotalTime.toString()).toFixed(0) * 1000).toISOString().substr(11, 8)}`}</span>
                  </h3>
                ) : (
                  <h3>
                    {variable.name !== undefined ? variable.label : null}
                    <span>{variable.unit !== undefined ? ` (${variable.unit})` : null}</span>
                  </h3>
                )}

                <div>
                  <Line
                    id={`canvas_${selectedVariables.indexOf(variable)}`}
                    type="line"
                    data={{
                      labels: dataLabels,
                      datasets: [
                        {
                          data: dataPlot,
                          label: variable.label,
                          borderColor: variable.color,
                          fill: true,
                          backgroundColor: lighten(0.4, variable.color ? variable.color : '#fff'),
                          tension: 0.05,
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </TablePlotContainer>
          );
        })}
      </div>
    );
  }, [selectedVariables, arcTotalTime, readingsList]);

  const submitHandler = useCallback(
    async (data: IFilters) => {
      setLoading(true);
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

      setLoading(false);

      return { ok: true };
    },
    [addToast, token],
  );

  const printReport = useCallback(async () => {
    const a = window.open('', '', 'height=500, width=500');

    if (a) {
      a.document.write('<html style="font-family:Roboto; font-size: 15px; text-align: -webkit-center"');
      a.document.write('<body id="report">');

      selectedVariables.map(variable => {
        const canvas = (document.getElementById(`canvas_${selectedVariables.indexOf(variable)}`) as unknown) as HTMLCanvasElement;
        const img = canvas.toDataURL('image/png');

        a.document.write(`</hr>`);
        a.document.write(`<h2 style="margin-top:50px;">${variable.label}</h2>`);
        if (variable.name === 'arc_status')
          a.document.write(
            `<h3>Tempo Total Abertura do Arco: <span style="color: #E56B14">${new Date(+parseFloat(arcTotalTime.toString()).toFixed(0) * 1000)
              .toISOString()
              .substr(11, 8)}</span></h3>`,
          );
        a.document.write(`<img src="${img}" style="margin-top:20px; margin-bottom: 20px;"/>`);

        const table = document.getElementById(`table_${selectedVariables.indexOf(variable)}`);
        if (table) a.document.write(table.outerHTML);
      });

      a.document.write('</body></html>');
      a.document.close();
    }
  }, [selectedVariables, arcTotalTime]);

  return (
    <Container>
      <Layout selectedItem="reports" />
      <Content>
        <Title>
          <AiOutlineFileDone />
          <p>Relatórios</p>
        </Title>

        <MainContent>
          <ControlsContainer>
            <Form ref={formRef} onSubmit={submitHandler}>
              {user.isadmin ? (
                <Select name="client_id" data={clientsList} selectedValue={selectedClient} onChange={e => handleSelectClient(e)} object="Cliente" />
              ) : (
                <h3>{user.name}</h3>
              )}

              <Select name="machine_id" data={machinesListByClient} object="Máquina" />
              <Input
                name="begin_date"
                type="datetime-local"
                placeholder="Início"
                value={inputBeginValueDate}
                onClick={() => setInputBeginValueDate(undefined)}
              />
              <Input name="final_date" type="datetime-local" placeholder="Fim" value={inputEndValueDate} onClick={() => setInputEndValueDate(undefined)} />
              <Button type="submit" name="login" isLoading={loading}>
                {loading ? 'Buscando...' : 'Buscar'}
              </Button>

              {readingsList.length > 0 && (
                <>
                  <Button type="button" onClick={printReport}>
                    Imprimir
                  </Button>
                  <VariablesContainer>
                    <div
                      aria-hidden="true"
                      className={selectedVariables.filter(selected => selected.name === 'voltageL1').length > 0 ? 'selected' : ''}
                      onClick={() => {
                        if (selectedVariables.filter(selected => selected.name === 'voltageL1').length > 0) {
                          setSelectedVariables(selectedVariables.filter(selected => selected.name !== 'voltageL1'));
                        } else {
                          setSelectedVariables([
                            ...selectedVariables,
                            {
                              name: 'voltageL1',
                              color: '#4D9261',
                              label: 'Tensão L1',
                              unit: 'V',
                            },
                          ]);
                        }
                      }}
                    >
                      <h2>Tensão L1</h2>
                    </div>

                    <div
                      aria-hidden="true"
                      className={selectedVariables.filter(selected => selected.name === 'voltageL2').length > 0 ? 'selected' : ''}
                      onClick={() => {
                        if (selectedVariables.filter(selected => selected.name === 'voltageL2').length > 0) {
                          setSelectedVariables(selectedVariables.filter(selected => selected.name !== 'voltageL2'));
                        } else {
                          setSelectedVariables([
                            ...selectedVariables,
                            {
                              name: 'voltageL2',
                              color: '#0085D3',
                              label: 'Tensão L2',
                              unit: 'V',
                            },
                          ]);
                        }
                      }}
                    >
                      <h2>Tensão L2</h2>
                    </div>

                    <div
                      aria-hidden="true"
                      className={selectedVariables.filter(selected => selected.name === 'voltageL3').length > 0 ? 'selected' : ''}
                      onClick={() => {
                        if (selectedVariables.filter(selected => selected.name === 'voltageL3').length > 0) {
                          setSelectedVariables(selectedVariables.filter(selected => selected.name !== 'voltageL3'));
                        } else {
                          setSelectedVariables([
                            ...selectedVariables,
                            {
                              name: 'voltageL3',
                              color: '#46BBC5',
                              label: 'Tensão L3',
                              unit: 'V',
                            },
                          ]);
                        }
                      }}
                    >
                      <h2>Tensão L3</h2>
                    </div>

                    <div
                      aria-hidden="true"
                      className={selectedVariables.filter(selected => selected.name === 'currentL1').length > 0 ? 'selected' : ''}
                      onClick={() => {
                        if (selectedVariables.filter(selected => selected.name === 'currentL1').length > 0) {
                          setSelectedVariables(selectedVariables.filter(selected => selected.name !== 'currentL1'));
                        } else {
                          setSelectedVariables([
                            ...selectedVariables,
                            {
                              name: 'currentL1',
                              color: '#14E545',
                              label: 'Corrente L1',
                              unit: 'A',
                            },
                          ]);
                        }
                      }}
                    >
                      <h2>Corrente L1</h2>
                    </div>

                    <div
                      aria-hidden="true"
                      className={selectedVariables.filter(selected => selected.name === 'currentL2').length > 0 ? 'selected' : ''}
                      onClick={() => {
                        if (selectedVariables.filter(selected => selected.name === 'currentL2').length > 0) {
                          setSelectedVariables(selectedVariables.filter(selected => selected.name !== 'currentL2'));
                        } else {
                          setSelectedVariables([
                            ...selectedVariables,
                            {
                              name: 'currentL2',
                              color: '#1F74BC',
                              label: 'Corrente L2',
                              unit: 'A',
                            },
                          ]);
                        }
                      }}
                    >
                      <h2>Corrente L2</h2>
                    </div>

                    <div
                      aria-hidden="true"
                      className={selectedVariables.filter(selected => selected.name === 'currentL3').length > 0 ? 'selected' : ''}
                      onClick={() => {
                        if (selectedVariables.filter(selected => selected.name === 'currentL3').length > 0) {
                          setSelectedVariables(selectedVariables.filter(selected => selected.name !== 'currentL3'));
                        } else {
                          setSelectedVariables([
                            ...selectedVariables,
                            {
                              name: 'currentL3',
                              color: '#f8e809',
                              label: 'Corrente L3',
                              unit: 'A',
                            },
                          ]);
                        }
                      }}
                    >
                      <h2>Corrente L3</h2>
                    </div>

                    <div
                      aria-hidden="true"
                      className={selectedVariables.filter(selected => selected.name === 'input_power').length > 0 ? 'selected' : ''}
                      onClick={() => {
                        if (selectedVariables.filter(selected => selected.name === 'input_power').length > 0) {
                          setSelectedVariables(selectedVariables.filter(selected => selected.name !== 'input_power'));
                        } else {
                          setSelectedVariables([
                            ...selectedVariables,
                            {
                              name: 'input_power',
                              color: '#1A1818',
                              label: 'Potência de Entrada',
                              unit: 'Kva/h',
                            },
                          ]);
                        }
                      }}
                    >
                      <h2>Potência de Entrada</h2>
                    </div>

                    <div
                      aria-hidden="true"
                      className={selectedVariables.filter(selected => selected.name === 'gas_flow').length > 0 ? 'selected' : ''}
                      onClick={() => {
                        if (selectedVariables.filter(selected => selected.name === 'gas_flow').length > 0) {
                          setSelectedVariables(selectedVariables.filter(selected => selected.name !== 'gas_flow'));
                        } else {
                          setSelectedVariables([
                            ...selectedVariables,
                            {
                              name: 'gas_flow',
                              color: '#E56B14',
                              label: 'Fluxo de Gás',
                              unit: 'm³',
                            },
                          ]);
                        }
                      }}
                    >
                      <h2>Fluxo de Gás</h2>
                    </div>

                    <div
                      aria-hidden="true"
                      className={selectedVariables.filter(selected => selected.name === 'arc_status').length > 0 ? 'selected' : ''}
                      onClick={() => {
                        if (selectedVariables.filter(selected => selected.name === 'arc_status').length > 0) {
                          setSelectedVariables(selectedVariables.filter(selected => selected.name !== 'arc_status'));
                        } else {
                          setSelectedVariables([
                            ...selectedVariables,
                            {
                              name: 'arc_status',
                              color: '#000',
                              label: 'Status do Arco',
                            },
                          ]);
                        }
                      }}
                    >
                      <h2>Status do Arco</h2>
                    </div>

                    <div
                      aria-hidden="true"
                      className={selectedVariables.filter(selected => selected.name === 'welding_current').length > 0 ? 'selected' : ''}
                      onClick={() => {
                        if (selectedVariables.filter(selected => selected.name === 'welding_current').length > 0) {
                          setSelectedVariables(selectedVariables.filter(selected => selected.name !== 'welding_current'));
                        } else {
                          setSelectedVariables([
                            ...selectedVariables,
                            {
                              name: 'welding_current',
                              color: '#E4003F',
                              label: 'Corrente de Solda',
                              unit: 'A',
                            },
                          ]);
                        }
                      }}
                    >
                      <h2>Corrente de Solda</h2>
                    </div>

                    <div
                      aria-hidden="true"
                      className={selectedVariables.filter(selected => selected.name === 'welding_voltage').length > 0 ? 'selected' : ''}
                      onClick={() => {
                        if (selectedVariables.filter(selected => selected.name === 'welding_voltage').length > 0) {
                          setSelectedVariables(selectedVariables.filter(selected => selected.name !== 'welding_voltage'));
                        } else {
                          setSelectedVariables([
                            ...selectedVariables,
                            {
                              name: 'welding_voltage',
                              color: '#987757',
                              label: 'Tensão de Solda',
                              unit: 'V',
                            },
                          ]);
                        }
                      }}
                    >
                      <h2>Tensão de Solda</h2>
                    </div>

                    <div
                      aria-hidden="true"
                      className={selectedVariables.filter(selected => selected.name === 'wire_speed').length > 0 ? 'selected' : ''}
                      onClick={() => {
                        if (selectedVariables.filter(selected => selected.name === 'wire_speed').length > 0) {
                          setSelectedVariables(selectedVariables.filter(selected => selected.name !== 'wire_speed'));
                        } else {
                          setSelectedVariables([
                            ...selectedVariables,
                            {
                              name: 'wire_speed',
                              color: '#6E0095',
                              label: 'Velocidade do Arame',
                              unit: '%',
                            },
                          ]);
                        }
                      }}
                    >
                      <h2>Velocidade do Arame</h2>
                    </div>
                  </VariablesContainer>
                </>
              )}
            </Form>
          </ControlsContainer>
          {reportToRender}
        </MainContent>
      </Content>
    </Container>
  );
};

export default Reports;
