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
      countries: [],
      loading: false,
    }}
  />
</React.Fragment>
```
