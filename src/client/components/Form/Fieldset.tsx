import React, { ReactNode } from 'react';
import classNames from 'classnames';

type FieldsetProps = {
  children: ReactNode,
  legend?: string,
  layout?: 'stacked' | 'horizontal',
};

function Fieldset(props: FieldsetProps) {
  const { children, layout, legend } = props;

  const classes = classNames(
    'uk-fieldset',
    { [`uk-form-${layout}`]: layout },
  );

  return (
    <fieldset className={classes}>
      {
        legend &&
        <legend className="uk-legend">{legend}</legend>
      }
      {children}
    </fieldset>
  );
}

export default Fieldset;
