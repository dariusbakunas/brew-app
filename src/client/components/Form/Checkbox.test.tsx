import { shallow } from 'enzyme';
import React from 'react';
import Checkbox from './Checkbox';

describe('Checkbox', () => {
  it('should render without throwing an error', () => {
    shallow(
      <Checkbox
        checked={true}
        label='Test'
        name=''
      />);
  });
});
