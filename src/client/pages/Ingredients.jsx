import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Container, Tabs, Nav } from '../components';
import Hops from './Hops';
import Fermentables from './Fermentables';

class Ingredients extends React.Component {
  render() {
    return (
      <div className='uk-section uk-section-small' style={{ flexGrow: 1 }}>
        <Container>
          <React.Fragment>
            <Tabs align='center' className='uk-visible@s uk-margin-medium-bottom'>
              <Nav.Item url='/ingredients/hops' label='Hops'/>
              <Nav.Item url='/ingredients/fermentables' label='Fermentables'/>
              <Nav.Item url='/ingredients/yeast' label='Yeast'/>
              <Nav.Item url='/ingredients/water' label='Water'/>
              <Nav.Item url='/ingredients/other' label='Other'/>
            </Tabs>
            <Switch>
              <Route path='/ingredients/hops' component={Hops}/>
              <Route path='/ingredients/fermentables' component={Fermentables}/>
            </Switch>
          </React.Fragment>
        </Container>
      </div>
    );
  }
}

export default Ingredients;
