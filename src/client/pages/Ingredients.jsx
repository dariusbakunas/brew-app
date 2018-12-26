import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Container from '../components/Container';
import Tabs from '../components/Tabs';
import Nav from '../components/Nav';
import Hops from './Hops';

class Ingredients extends React.Component {
  render() {
    return (
      <div className='uk-section uk-section-small' style={{ flexGrow: 1 }}>
        <Container>
          <React.Fragment>
            <Tabs align='center' className='uk-visible@s'>
              <Nav.Item url='/ingredients/hops' label='Hops'/>
              <Nav.Item url='/ingredients/fermentables' label='Fermentables'/>
              <Nav.Item url='/ingredients/yeast' label='Yeast'/>
              <Nav.Item url='/ingredients/water' label='Water'/>
              <Nav.Item url='/ingredients/other' label='Other'/>
            </Tabs>
            <Switch>
              <Route path='/ingredients/hops' component={Hops}/>
            </Switch>
          </React.Fragment>
        </Container>
      </div>
    );
  }
}

export default Ingredients;
