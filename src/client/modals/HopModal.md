```jsx
const {HopModal} = require('./HopModal');
const Button = require('../components/Button').default;
const hop = {
  id: 123,
  aaLow: 9,
  aaHigh: 14,
  aroma: true,
  bittering: true,
  origin: {
    id: 3,
  },
  betaLow: 4,
  betaHigh: 6.5,
  name: 'Agnus',
  description: 'Strong spicy and herbal notes',
}
initialState = { open: false, hop: null }
;<React.Fragment>
  <Button variation='primary' onClick={() => setState({ open: true, hop: hop })}>Open</Button>
  <HopModal
    id='hop-modal'
    hop={state.hop}
    open={state.open}
    onHide={() => setState({ open: false, hop: null })}
    getAllCountries={{
      countries: [
        { id: 1, name: 'Country A' },
        { id: 2, name: 'Country B' },
        { id: 3, name: 'Country C' },
        { id: 4, name: 'Country D' },
      ],
      loading: false,
    }}
  />
</React.Fragment>
```
