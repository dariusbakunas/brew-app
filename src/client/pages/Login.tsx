import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';
import { Container, Header, Icon } from '../components';

const GET_LOGIN_QUOTE = gql`
  query GetRandomQuote {
    randomQuote {
      text
      author
    }
  }
`;

interface ILoginPageProps {
  data: {
    randomQuote: {
      author: string,
      test: string,
    },
  };
}

class Login extends React.Component<ILoginPageProps> {
  public render() {
    // TODO: convert query to HOC

    return (
      <Query query={GET_LOGIN_QUOTE}>
        {
          ({ loading, data, error }) => {
            if (error) {
              console.log(error);
              return 'Error';
            }

            return (
              <div className='login-container'>
                <Container size='small'>
                  <Header as='h1' textAlign='center'>BREW BEER</Header>
                  <div className='hop-logo'>
                    <a href='/auth' aria-label='Login'>
                      <Icon icon='logo' className='animated pulse infinite'/>
                    </a>
                  </div>
                  <blockquote className='login-quote'>
                    <p className='uk-margin-small-bottom'>
                      <q>{data && data.randomQuote ? data.randomQuote.text : ''}</q>
                    </p>
                    <footer>
                      <cite>{data && data.randomQuote ? data.randomQuote.author : ''}</cite>
                    </footer>
                  </blockquote>
                </Container>
              </div>
            );
          }}
      </Query>
    );
  }
}

export default Login;
