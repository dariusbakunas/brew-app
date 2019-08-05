import { shallow } from 'enzyme';
import React from 'react';

import { Form } from '../index';

describe('Input', () => {
  it('should render without throwing an error', () => {
    const wrapper = shallow(<Form.Input id="test-input" label="test" name="test" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onChange handler on user input', () => {
    const handler = jest.fn();
    const wrapper = shallow(<Form.Input label="test" name="test" onChange={handler} />);
    const event = { currentTarget: { value: '123456789abcde' } };
    wrapper.find('input').simulate('change', event);
    expect(handler).toHaveBeenCalledWith(event, { name: 'test', value: '123456789abcde' });
  });

  it('should render with icon', () => {
    const wrapper = shallow(<Form.Input id="test-input" label="test" name="test" icon="percent" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should convert input to number if type is number', () => {
    const handler = jest.fn();
    const wrapper = shallow(<Form.Input label="test" name="test" type="number" step={0.1} onChange={handler} />);
    const event = { currentTarget: { value: '325.6' } };
    wrapper.find('input').simulate('change', event);
    expect(handler).toHaveBeenCalledWith(event, { name: 'test', value: 325.6 });
  });

  it('should render error span if error is specified', () => {
    const wrapper = shallow(<Form.Input label="test" name="test" icon="percent" error="Test error" />);
    expect(wrapper.find('input').hasClass('uk-form-danger')).toBeTruthy();
    expect(wrapper.find('.uk-text-danger')).toHaveLength(1);
    expect(wrapper.find('.uk-text-danger').text()).toEqual('Test error');
  });
});
