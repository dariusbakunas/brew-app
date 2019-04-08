import { shallow } from 'enzyme';
import React from 'react';
import { Button } from '../index';

describe('Button', () => {
  it('should render without throwing an error', () => {
    expect(shallow(<Button>test</Button>).contains(
      <button className='uk-button uk-button-default' type='button'>test</button>,
    )).toBeTruthy();
  });

  it('should call onClick handler on click event', () => {
    const handler = jest.fn();
    const wrapper = shallow(<Button onClick={handler}/>);
    wrapper.find('button').simulate('click');
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should apply additional classes', () => {
    const wrapper = shallow(<Button className='test-class'/>);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders icon on the left by default', () => {
    const wrapper = shallow(<Button icon='trash'>test</Button>);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders icon on the right if specified', () => {
    const wrapper = shallow(<Button icon='trash' iconPosition='right'>test</Button>);
    expect(wrapper).toMatchSnapshot();
  });

  it('should set variation class', () => {
    const wrapper = shallow(<Button variation='primary'>test</Button>);
    expect(wrapper).toMatchSnapshot();
  });
});
