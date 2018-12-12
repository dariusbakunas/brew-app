import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Header from '../components/Header';
import Container from '../components/Container';

const GET_LOGIN_QUOTE = gql`
  query GetRandomQuote {
    randomQuote {
      text
      author
    }
  }
`;

class Login extends React.Component {
  render() {
    return (
      <Query query={GET_LOGIN_QUOTE}>
        {
          ({ loading, data, error }) => {
            if (error) {
              console.log(error);
              return 'Error';
            }

            return (
              <div className='uk-flex uk-flex-middle' style={{ height: '100%' }}>
                <Container size='small'>
                  <Header as='h1' textAlign='center'>BREW BEER</Header>
                  <div className='power-btn'>
                    <a href='/auth' aria-label='Login'>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 79 79">
                        <circle cx="39.5" cy="39.5" r="38"/>
                        <path d="M47.5,25.64a16,16,0,1,1-16,0"/>
                        <line x1="39.5" y1="31.5" x2="39.5" y2="19.5"/>
                      </svg>
                    </a>
                  </div>
                  <blockquote className='login-quote'>
                    <p className="uk-margin-small-bottom"><q>{data && data.randomQuote ? data.randomQuote.text : ''}</q></p>
                    <footer>
                      <cite>{data && data.randomQuote ? data.randomQuote.author : ''}</cite>
                    </footer>
                  </blockquote>
                </Container>
              </div>
            );
          }
        }
      </Query>
    );
  }
}

export default Login;
