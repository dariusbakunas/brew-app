import React from 'react';
import Container from '../components/Container';
import Grid from '../components/Grid';
import Card from '../components/Card';

function Dashboard(props) {
  return (
    <div className='uk-section uk-section-small' style={{ flexGrow: 1 }}>
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
  );
}

export default Dashboard;
