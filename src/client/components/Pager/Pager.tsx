import React from 'react';
import Button from '../Button';

type PagerProps = {
  hasNextPage: boolean,
  hasPrevPage: boolean,
  onNextPage: () => void,
  onPrevPage: () => void,
};

class Pager extends React.Component<PagerProps> {
  handleKeyDown = (e: KeyboardEvent) => {
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

export default Pager;
