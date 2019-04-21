import classNames from 'classnames';
import React from 'react';
import Input from './Input';

interface IAutoCompleteProps {
  items: Array<{
    value: string,
    label: string,
  }>;
}

interface IWindow {
  UIkit?: any;
}

declare var window: IWindow;

class AutoComplete extends React.Component<IAutoCompleteProps> {
  private dropdownRef: React.RefObject<any>;

  constructor(props: IAutoCompleteProps) {
    super(props);
    this.dropdownRef = React.createRef();
  }

  public componentDidMount(): void {
    window.UIkit.dropdown(this.dropdownRef.current, {
      mode: 'click',
    });
  }

  public render() {
    return (
      <React.Fragment>
        <Input/>
        <div ref={this.dropdownRef}>
          <ul className='uk-nav uk-dropdown-nav'>
            {/*<li className='uk-active'><a href='#'>Active</a></li>*/}
            {
              this.props.items.map((item) => (
                <li key={item.value}>
                  <a href='#'>{item.label}</a>
                </li>
              ))
            }
          </ul>
        </div>
      </React.Fragment>
    );
  }
}

export default AutoComplete;
