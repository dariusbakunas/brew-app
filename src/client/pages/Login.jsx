import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {Grid, Transition} from 'semantic-ui-react';

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
              <Transition visible={!loading} animation='scale' duration={500}>
                <div className='login-container'>
                  <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                      <h1>MAKE BEER</h1>
                      <div className='power-btn'>
                        <a href='/auth' aria-label='Login'>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 79 79">
                            <circle cx="39.5" cy="39.5" r="38"/>
                            <path d="M47.5,25.64a16,16,0,1,1-16,0"/>
                            <line x1="39.5" y1="31.5" x2="39.5" y2="19.5"/>
                          </svg>
                        </a>
                      </div>
                      <figure>
                        <blockquote className='login-quote'>
                          <p>{data && data.randomQuote ? data.randomQuote.text : ''}</p>
                          <footer>
                            <small>{data && data.randomQuote ? data.randomQuote.author : ''}</small>
                          </footer>
                        </blockquote>
                      </figure>
                    </Grid.Column>
                  </Grid>
                </div>
              </Transition>
            );
          }
        }
      </Query>
    );
  }
}

export default Login;
