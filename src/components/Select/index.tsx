import React, { useRef, useEffect, SelectHTMLAttributes } from 'react';

import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';

import { Container, Error } from './styles';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  data: ISelectData[];
  selectedValue?: string;
  object: string;
}

interface ISelectData {
  id: string;
  name?: string;
  description?: string;
}

const Select: React.FC<SelectProps> = ({ name, data, selectedValue, object, ...rest }) => {
  const selectRef = useRef<HTMLSelectElement>(null);
  const { fieldName, error, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container error={!!error}>
      <select {...rest} ref={selectRef}>
        <option key="0" value="">{`Selecione ${object}...`}</option>
        {data.map((element: ISelectData) => {
          return (
            <option key={element.id} value={element.id} selected={selectedValue ? selectedValue === element.id : false}>
              {element.name ? element.name : element.description ? element.description : null}
            </option>
          );
        })}
      </select>
      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};
export default Select;
