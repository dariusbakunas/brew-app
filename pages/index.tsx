import React from 'react';
import { Card, Container, Grid } from '../components';
import Main from '../layouts/main';

const Index = () => {
  return (
    <Main>
      <div className='uk-section uk-section-small test' style={{ flexGrow: 1 }}>
        <Container>
          <Grid className='uk-flex-center'>
            <div>
              <Card variation='default'>
                Link 1
              </Card>
            </div>
            <div>
              <Card variation='default'>
                Link 2
              </Card>
            </div>
            <div>
              <Card variation='default'>
                Link 3
              </Card>
            </div>
          </Grid>
        </Container>
      </div>
    </Main>
  );
};

export default Index;
