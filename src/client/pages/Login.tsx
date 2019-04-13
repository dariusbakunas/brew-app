import React from 'react';
import { compose } from 'react-apollo';
import { Container, Header, Icon } from '../components';
import { getLoginQuote } from '../HOC/login'

interface ILoginPageProps {
  getLoginQuote: {
    randomQuote: {
      author: string,
      text: string,
    },
  };
}

class Login extends React.Component<ILoginPageProps> {
  public render() {
    const { randomQuote } = this.props.getLoginQuote;

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
              <q>{randomQuote ? randomQuote.text : ''}</q>
            </p>
            <footer>
              <cite>{randomQuote ? randomQuote.author : ''}</cite>
            </footer>
          </blockquote>
        </Container>
      </div>
    );
  }
}

export default compose(
  getLoginQuote,
)(Login);
