```jsx
const {FermentableModal} = require('./FermentableModal');
const Button = require('../components/Button').default;
const fermentable = {
  id: 123,
  category: 'GRAIN',
  color: 2.8,
  description: 'Specialty Grain',
  name: 'Acid Malt',
  origin: {
    id: 4,
    name: 'Country D',    
  },
  potential: 1.027,
  type: 'SPECIALTY',
  yield: 58.7,
};

initialState = { open: false, fermentable: null }
;<React.Fragment>
  <Button variation='primary' onClick={() => setState({ open: true, fermentable: fermentable })}>Open</Button>
  <FermentableModal
    id='fermentable-modal'
    fermentable={state.fermentable}
    open={state.open}
    onHide={() => setState({ open: false, fermentable: null })}
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
