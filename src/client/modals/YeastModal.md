```jsx
const {YeastModal} = require('./YeastModal');
const Button = require('../components/Button').default;
const yeast = {
  form: 'DRY',
  description: 'Test yeast',
  flocculation: 'MEDIUM',
  minTemp: 65,
  maxTemp: 75,
  name: 'American Ale (#1056)',
  lab: {
    id: 2,
    name: 'Lab B',
  },
  type: 'ALE',
}
initialState = { open: false, yeast: null }
;<React.Fragment>
  <Button variation='primary' onClick={() => setState({ open: true, yeast: yeast })}>Open</Button>
  <YeastModal
    id='yeast-modal'
    getYeastLabs={{
      yeastLabs: [
        { id: '1', name: 'Lab A'},
        { id: '2', name: 'Lab B'},
        { id: '3', name: 'Lab C'},
      ]
    }}
    yeast={state.yeast}
    open={state.open}
    onHide={() => setState({ open: false, yeast: null })}  
  />
</React.Fragment>
```
