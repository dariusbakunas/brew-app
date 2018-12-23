import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class LoadingBar extends React.Component {
  state = {
    shouldRender: this.props.active,
  };

  static propTypes = {
    active: PropTypes.bool,
    delay: PropTypes.number,
  };

  static defaultProps = {
    delay: 500,
  };

  componentDidUpdate(prevProps) {
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
