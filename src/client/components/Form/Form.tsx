import React, { ReactNode } from 'react';
import Input from './Input';
import Checkbox from './Checkbox';
import Fieldset from './Fieldset';
import Spinner from '../Spinner';
import TextArea from './TextArea';
import Select from './Select';
import Radio from './Radio';

type FormProps = {
  children: ReactNode,
  loading: boolean,
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
};

class Form extends React.Component<FormProps> {
  static Fieldset = Fieldset;

  static Input = Input;

  static Checkbox = Checkbox;

  static Radio = Radio;

  static TextArea = TextArea;

  static Select = Select;

  render() {
    const { children, loading, onSubmit } = this.props;

    return (
      <form onSubmit={onSubmit}>
        {children}
        <Spinner active={loading}/>
      </form>
    );
  }
}

export default Form;
