```jsx
const {WaterModal} = require('./WaterModal');
const Button = require('../components/Button').default;
const water = {
  id: 123,
  name: '',
  alkalinity: 80,
  bicarbonate: 98,
  calcium: 37,
  chloride: 20,
  magnesium: 9,
  name: 'Lyndhurst, OH',
  pH: 7.2,
  sodium: 14,
  sulfate: 11,
};
initialState = { open: false, water: null }
;<React.Fragment>
  <Button variation='primary' onClick={() => setState({ open: true, water: water })}>Open</Button>
  <WaterModal
    id='water-modal'
    water={state.water}
    open={state.open}
    onHide={() => setState({ open: false, water: null })}
  />
</React.Fragment>
```
