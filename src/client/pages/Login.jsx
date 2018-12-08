import React from 'react';
import PropTypes from 'prop-types';

class Login extends React.Component {
  static propTypes = {
    quote: PropTypes.shape({
      text: PropTypes.string.isRequired,
      author: PropTypes.string,
    }).isRequired,
  };

  render() {
    return (
      <div className='login-container'>
        <h1>MAKE BEER</h1>
        <div className='power-btn'>
          <a href='/login' aria-label='Login'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 79 79">
              <circle cx="39.5" cy="39.5" r="38"/>
              <path d="M47.5,25.64a16,16,0,1,1-16,0"/>
              <line x1="39.5" y1="31.5" x2="39.5" y2="19.5"/>
            </svg>
          </a>
        </div>
        <figure>
          <blockquote className='login-quote'>
            <p>{this.props.quote.text}</p>
            <footer>
              <small>{this.props.quote.author}</small>
            </footer>
          </blockquote>
        </figure>
      </div>
    );
  }
}

export default Login;
