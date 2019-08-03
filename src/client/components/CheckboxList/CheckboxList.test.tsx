import { shallow } from 'enzyme';
import React from 'react';
import CheckboxList from './CheckboxList';

describe('CheckboxList', () => {
  it('should render without throwing an error', () => {
    const items = [
      {key: 'test1', label: 'Test 1', checked: false},
      {key: 'test2', label: 'Test 2', checked: false},
      {key: 'test3', label: 'Test 3', checked: true},
      {key: 'test4', label: 'Test 4', checked: false},
      {key: 'test5', label: 'Test 5', checked: true},
    ];

    shallow(<CheckboxList items={items}/>);
  });
});
