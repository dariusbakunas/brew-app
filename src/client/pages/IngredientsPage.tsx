import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Container, Nav, Tabs } from '../../../components';
import PagingProvider from '../../../context/PagingProvider';
import Fermentables from './FermentablesPage';
import Hops from './HopsPage';
import Water from './WaterPage';
import Yeast from './YeastPage';

class IngredientsPage extends React.Component {
  public render() {
    return (
      <div className='uk-section uk-section-small test' style={{ flexGrow: 1 }}>
        <Container>
          <PagingProvider>
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
              <Route path='/ingredients/water' component={Water}/>
            </Switch>
          </PagingProvider>
        </Container>
      </div>
    );
  }
}

export default IngredientsPage;
