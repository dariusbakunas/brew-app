import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';

class Pager extends React.Component {
  handleKeyDown = (e) => {
    const {
      hasPrevPage, hasNextPage, onNextPage, onPrevPage,
    } = this.props;

    switch (e.key) {
      case 'ArrowLeft':
        if (hasPrevPage) {
          onPrevPage();
        }
        break;
      case 'ArrowRight':
        if (hasNextPage) {
          onNextPage();
        }
        break;
      default:
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  render() {
    const {
      hasPrevPage, hasNextPage, onNextPage, onPrevPage,
    } = this.props;

    return (
      <ul className="uk-pagination uk-flex-right">
        {
          hasPrevPage &&
          <li>
            <Button icon='chevronLeft' onClick={onPrevPage}>
              Prev
            </Button>
          </li>
        }
        {
          hasNextPage &&
          <li>
            <Button
              icon='chevronRight'
              iconPosition='right'
              onClick={onNextPage}>
              Next
            </Button>
          </li>
        }
      </ul>
    );
  }
}

Pager.propTypes = {
  hasPrevPage: PropTypes.bool,
  hasNextPage: PropTypes.bool,
  onNextPage: PropTypes.func.isRequired,
  onPrevPage: PropTypes.func.isRequired,
};

export default Pager;
