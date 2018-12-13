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
              <div className='login-container'>
                <Container size='small'>
                  <Header as='h1' textAlign='center'>BREW BEER</Header>
                  <div className='power-btn'>
                    <a href='/auth' aria-label='Login'>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 141.28 227.96">
                        <title>Hop</title>
                        <g id="Layer_2" data-name="Main">
                          <path className="cls-1"
                                d="M56,52.31S41.73,49.52,26.6,64.44,6.25,84,6.25,84s19.6,11.11,40.68-1.74C39.75,63.44,56,52.31,56,52.31Z"/>
                          <path className="cls-1"
                                d="M86.82,52.31s14.31-2.79,29.44,12.13S136.61,84,136.61,84,117,95.14,95.93,82.29C103.11,63.44,86.82,52.31,86.82,52.31Z"/>
                          <path className="cls-1"
                                d="M72,105.14S49.47,82.9,49.51,70.3s13.24-18.19,20.9-18.2c6,0,22.3.34,22.3,19C92.71,85.89,81.59,91.59,72,105.14Z"/>
                          <path className="cls-1"
                                d="M49.51,86.8S44.06,91,44.06,102.23s7.24,19,27.05,38.28c19.12-17.41,25.64-28.66,26.09-37.28S91.82,86.8,91.82,86.8l-19.51,24Z"/>
                          <path className="cls-1"
                                d="M44.06,88.49a58.65,58.65,0,0,1-9.94,21.92C25.77,121.66,1,126.08,1,126.08s7.35-11.63,8.66-19.69,1.86-15.52,1.86-15.52a62.61,62.61,0,0,0,16.64,1.37C38.31,91.87,44.06,88.49,44.06,88.49Z"/>
                          <path className="cls-1"
                                d="M97.22,88.49a58.58,58.58,0,0,0,10,21.92c8.34,11.25,33.09,15.67,33.09,15.67s-7.36-11.63-8.66-19.69-1.86-15.52-1.86-15.52a62.72,62.72,0,0,1-16.65,1.37C103,91.87,97.22,88.49,97.22,88.49Z"/>
                          <path className="cls-1" d="M1,126.08s7.35-10.74,8.66-18.8,1.86-16.41,1.86-16.41"/>
                          <path className="cls-1"
                                d="M40.86,112.4s-1.24,2.89-9.09,7.44c-5.29,3.07-10.27,5.79-10.27,5.79l13.55,25.93,21.43-19S46,124.41,40.86,112.4Z"/>
                          <path className="cls-1"
                                d="M100.38,112.76s1.24,2.89,9.09,7.45c5.28,3.06,10.27,5.78,10.27,5.78l-13.55,25.93-21.43-19S95.27,124.77,100.38,112.76Z"/>
                          <path className="cls-1"
                                d="M17.28,126.08s-6.62-.4-9.08,5.28,1.69,7.89-2.85,25.28a122.4,122.4,0,0,0,21.14-12.52Z"/>
                          <path className="cls-1"
                                d="M124.12,127.41s6.62-.4,9.08,5.28-1.68,7.88,2.86,25.28a121.91,121.91,0,0,1-21.15-12.53Z"/>
                          <path className="cls-1"
                                d="M60,135.64s-15.28,9.57-6.88,19.63,18,20.2,18,20.2,14.16-16.8,16.22-20.2,8.85-10.7-5.11-20.2A80.1,80.1,0,0,1,70.64,147.4Z"/>
                          <path className="cls-1"
                                d="M33,158l-5-10.58s-4.16,1.11-8.53,6.5c2,16.4,17.05,30.31,17.05,30.31a75.06,75.06,0,0,1,17.68-20.83c-8.53-8.1-9.92-15.53-9.92-15.53Z"/>
                          <path className="cls-1"
                                d="M107.16,158.91l5.16-10.52s4.14,1.17,8.42,6.62c-2.25,16.37-17.53,30.08-17.53,30.08a74.56,74.56,0,0,0-17.35-21c8.66-8,10.16-15.41,10.16-15.41Z"/>
                          <path className="cls-1"
                                d="M15.92,154.78s3.59,15.12,8.37,21.61c-4.78,6.2-12.74,8.7-12.74,8.7s4.59-16.33,2.32-28.45C15.52,154.18,15.92,154.78,15.92,154.78Z"/>
                          <path className="cls-1"
                                d="M124.51,155.68s-3.59,15.12-8.37,21.6c4.78,6.21,12.74,8.7,12.74,8.7s-4.59-16.33-2.32-28.45C124.91,155.07,124.51,155.68,124.51,155.68Z"/>
                          <path className="cls-1"
                                d="M44.06,180.38l-6.09,11L27.76,182s-7,15.68,18.62,29.61C56.48,201.66,54.28,188.38,44.06,180.38Z"/>
                          <path className="cls-1"
                                d="M96,181.27l6.1,11,10.2-9.44s7,15.69-18.62,29.61C83.62,202.56,85.82,189.27,96,181.27Z"/>
                          <path className="cls-1"
                                d="M56.48,168.12s-12.92,8.61,0,20.91,14.16,13.33,14.16,13.33l14.12-15.14s12.6-12,0-20.48c-5.07,7.27-14.05,15.41-14.05,15.41Z"/>
                          <path className="cls-1"
                                d="M57.92,196.88s-4.37,7.12,4.22,18.55c6.39,8.49,8.41,11.77,8.41,11.77s1.74-1.52,9-12c9.39-13.69,1.42-17.84,1.42-17.84L70.55,208Z"/>
                          <path className="cls-1"
                                d="M75.43,47.42h-9S67.08,23.58,56,3.78c1.4-3,3.28-3.25,3.28-3.25S72.81,17.14,75.43,47.42Z"/>
                        </g>
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
