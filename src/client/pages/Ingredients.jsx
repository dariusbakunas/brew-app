import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Container, Tabs, Nav } from '../components';
import Hops from './Hops';
import Fermentables from './Fermentables';
import Yeast from './Yeast';

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
            </Tabs>
            <Switch>
              <Route path='/ingredients/hops' component={Hops}/>
              <Route path='/ingredients/fermentables' component={Fermentables}/>
              <Route path='/ingredients/yeast' component={Yeast}/>
            </Switch>
          </React.Fragment>
        </Container>
      </div>
    );
  }
}

export default Ingredients;
