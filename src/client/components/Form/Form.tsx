import classNames from 'classnames';
import React, { Component, ReactNode } from 'react';
import Spinner from '../Spinner';
import AutoComplete from './AutoComplete';
import Checkbox from './Checkbox';
import Fieldset from './Fieldset';
import Input from './Input';
import Radio from './Radio';
import Select from './Select';
import TextArea from './TextArea';

interface IFormProps {
  children: ReactNode;
  className?: string;
  loading?: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

class Form extends Component<IFormProps> {
  public static AutoComplete = AutoComplete;

  public static Fieldset = Fieldset;

  public static Input = Input;

  public static Checkbox = Checkbox;

  public static Radio = Radio;

  public static TextArea = TextArea;

  public static Select = Select;

  public render() {
    const { children, className, loading, onSubmit } = this.props;

    const classes = classNames(className);

    return (
      <form className={classes} onSubmit={onSubmit}>
        {children}
        <Spinner active={loading} />
      </form>
    );
  }
}

export default Form;
