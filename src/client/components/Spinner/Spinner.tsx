import classNames from "classnames";
import React from "react";

interface ISpinnerProps {
  active: boolean;
  delay?: number;
}

class Spinner extends React.Component<ISpinnerProps> {
  public readonly state = {
    shouldRender: this.props.active,
  };

  private _isMounted: boolean;

  static defaultProps: Partial<ISpinnerProps> = {
    delay: 500,
  };

  public componentDidMount(): void {
    this._isMounted = true;
  }

  public componentWillUnmount(): void {
    this._isMounted = false;
  }

  public componentDidUpdate(prevProps: ISpinnerProps) {
    if (prevProps.active && !this.props.active) {
      setTimeout(() => {
        if (this._isMounted) {
          this.setState({ shouldRender: false });
        }
      }, this.props.delay);
    } else if (!prevProps.active && this.props.active) {
      this.setState({ shouldRender: true });
    }
  }

  public render() {
    if (!this.state.shouldRender) {
      return null;
    }

    const classes = classNames("sk-cube-grid", "uk-position-center");

    return (
      <div className="uk-overlay-default uk-position-cover">
        <div className={classes}>
          <div className="sk-cube sk-cube1" />
          <div className="sk-cube sk-cube2" />
          <div className="sk-cube sk-cube3" />
          <div className="sk-cube sk-cube4" />
          <div className="sk-cube sk-cube5" />
          <div className="sk-cube sk-cube6" />
          <div className="sk-cube sk-cube7" />
          <div className="sk-cube sk-cube8" />
          <div className="sk-cube sk-cube9" />
        </div>
      </div>
    );
  }
}

export default Spinner;
