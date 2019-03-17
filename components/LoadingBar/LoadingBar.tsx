import * as React from 'react';
import classNames from 'classnames';

type LoadingBarProps = {
  active: boolean,
  delay?: number,
};

class LoadingBar extends React.Component<LoadingBarProps> {
  state = {
    shouldRender: this.props.active,
  };

  static defaultProps: Partial<LoadingBarProps> = {
    delay: 500,
  };

  componentDidUpdate(prevProps: LoadingBarProps) {
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
      'loader',
      'uk-margin-small-bottom',
    );

    return (
      <div className={classes}/>
    );
  }
}

export default LoadingBar;
