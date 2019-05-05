import debounce from 'lodash.debounce';
import React from 'react';
import Input, { InputChangeHandlerType } from './Input';

interface IItem {
  value: string;
  label: string;
}

interface IAutoCompleteProps {
  debounced?: boolean;
  items: IItem[];
  name: string;
  onInputChange?: (id: string | number | boolean | string[]) => void;
  onSelect?: (item: IItem) => void;
  style?: object;
  selected: IItem;
}

interface IAutoCompleteState {
  search: string;
}

interface IWindow {
  UIkit?: any;
}

declare var window: IWindow;

class AutoComplete extends React.Component<IAutoCompleteProps, IAutoCompleteState> {
  public readonly state: IAutoCompleteState;
  private dropdownRef: React.RefObject<any>;
  private inputRef: React.RefObject<any>;

  constructor(props: IAutoCompleteProps) {
    super(props);
    this.dropdownRef = React.createRef();
    this.inputRef = React.createRef();

    if (props.debounced) {
      this.changeCallback = debounce(this.changeCallback, 300);
    }

    this.state = {
      search: props.selected.label,
    };
  }

  public componentDidMount(): void {
    window.UIkit.dropdown(this.dropdownRef.current, { mode: 'click' });
  }

  public render() {
    const { style } = this.props;
    const { search } = this.state;

    return (
      <div style={style}>
        <Input
          name='search'
          onBlur={() => setTimeout(() => this.setState({ search: this.props.selected.label }), 100)}
          onChange={this.handleSearchChange}
          ref={this.inputRef}
          value={search}
        />
        <div ref={this.dropdownRef}>
          <ul className='uk-nav uk-dropdown-nav'>
            {/*<li className='uk-active'><a href='#'>Active</a></li>*/}
            {
              this.props.items.map((item) => (
                <li key={item.value}>
                  <a href='#' onClick={() => this.handleClick(item)}>{item.label}</a>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    );
  }

  private handleClick = (item: IItem) => {
    this.setState({
      search: item.label,
    }, () => {
      if (this.props.onSelect) {
        this.props.onSelect(item);
      }
    });
  }

  private changeCallback = (value: string | number | boolean | string[]) => {
    if (this.props.onInputChange) {
      this.props.onInputChange(value);
    }
  }

  private handleSearchChange: InputChangeHandlerType = (e, { value }) => {
    // @ts-ignore
    this.setState({
      search: value,
    });
    window.UIkit.dropdown(this.dropdownRef.current).show();
    this.changeCallback(value);
  }
}

export default AutoComplete;
