import React from 'react';
import { Button } from '../components';
import FermentableInputRow from './FermentableInputRow';

interface IFermentable {
  id: string;
  key: string;
  name: string;
  unit: string;
  weight: number;
}

interface IRecipeFermentableProps {
  fermentables: ReadonlyArray<IFermentable>;
  onAdd: () => void;
  onRemove: (key: string) => void;
  onUpdate: (key: string, fermentable: IFermentable) => void;
}

function RecipeFermentables({ fermentables, onAdd, onRemove, onUpdate }: IRecipeFermentableProps) {
  return (
    <React.Fragment>
      {
        fermentables.map((fermentable) => (
          <FermentableInputRow
            fermentable={fermentable}
            key={fermentable.key}
            onChange={(f: IFermentable) => onUpdate(fermentable.key, f)}
            onRemove={() => onRemove(fermentable.key)}
          />
        ))
      }
      <div className='uk-margin-small-top'>
        <Button onClick={onAdd} className='uk-button-small' variation='link'>Add Fermentable</Button>
      </div>
    </React.Fragment>
  );
}

export default RecipeFermentables;
