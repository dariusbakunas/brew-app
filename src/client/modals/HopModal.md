Hop Modal

```jsx
const {HopModal} = require('./HopModal');
const Button = require('../components/Button').default;
initialState = { open: false }
;<React.Fragment>
  <Button variation='primary' onClick={() => setState({ open: true })}>Open</Button>
  <HopModal
    id='hop-modal'
    open={state.open}
    onHide={() => setState({ open: false })}
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
