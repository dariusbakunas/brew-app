import React from 'react';
import Checkbox from '../Form/Checkbox';

type ItemArray = Array<{ label: string; key: string; checked?: boolean }>;

interface ICheckboxListProps {
  onChange?: (items: ICheckboxListState) => void;
  items: ItemArray;
}

interface ICheckboxListState {
  [key: string]: boolean;
}

class CheckboxList extends React.Component<ICheckboxListProps> {
  public readonly state: ICheckboxListState;

  constructor(props: ICheckboxListProps) {
    super(props);

    this.state = this.itemsToState(props.items);
  }

  public componentDidUpdate(prevProps: Readonly<ICheckboxListProps>): void {
    if (prevProps.items !== this.props.items) {
      this.setState(this.itemsToState(this.props.items));
    }
  }

  public render() {
    const { items } = this.props;

    return (
      <ul className="uk-list">
        {items.map((item) => (
          <li key={item.key}>
            <Checkbox checked={!!this.state[item.key]} label={item.label} name={item.key} onChange={(e: React.FormEvent<HTMLInputElement>) => this.handleChange(item.key, e.currentTarget.checked)} />
          </li>
        ))}
      </ul>
    );
  }

  private handleChange(key: string, value: boolean) {
    this.setState({ [key]: value }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.state);
      }
    });
  }

  private itemsToState(items: ItemArray) {
    return items.reduce((acc: ICheckboxListState, { key, checked }) => {
      acc[key] = !!checked;
      return acc;
    }, {});
  }
}

export default CheckboxList;
