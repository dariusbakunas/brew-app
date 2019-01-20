import * as React from 'react';
import classNames from 'classnames';

type SpinnerProps = {
  active: boolean,
  delay?: number,
};

class Spinner extends React.Component<SpinnerProps> {
  readonly state = {
    shouldRender: this.props.active,
  };

  static defaultProps: Partial<SpinnerProps> = {
    delay: 500,
  };

  componentDidUpdate(prevProps: SpinnerProps) {
    if (prevProps.active && !this.props.active) {
      setTimeout(
        () => this.setState({ shouldRender: false }),
        this.props.delay,
      );
    } else if (!prevProps.active && this.props.active) {
      this.setState({ shouldRender: true });
    }
  }

  render() {
    if (!this.state.shouldRender) {
      return null;
    }

    const classes = classNames(
      'sk-cube-grid',
      'uk-position-center',
    );

    return (
      <div className="uk-overlay-default uk-position-cover">
        <div className={classes}>
          <div className="sk-cube sk-cube1"/>
          <div className="sk-cube sk-cube2"/>
          <div className="sk-cube sk-cube3"/>
          <div className="sk-cube sk-cube4"/>
          <div className="sk-cube sk-cube5"/>
          <div className="sk-cube sk-cube6"/>
          <div className="sk-cube sk-cube7"/>
          <div className="sk-cube sk-cube8"/>
          <div className="sk-cube sk-cube9"/>
        </div>
      </div>
    );
  }
}

export default Spinner;
