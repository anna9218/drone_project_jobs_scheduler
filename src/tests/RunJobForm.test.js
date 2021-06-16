import React from 'react';
import RunJobForm from '../components/RunJobForm';
import { shallow, mount, render } from '../enzyme';



it('renders without crashing', () => {
    shallow(<RunJobForm />);
  });


describe('RunJobForm Test Suite', () => {

    // checking if the form elements exist.
    it('should render the form', () => {
        const wrapper = shallow(<RunJobForm />);  // shallow renders a single component each time. In other words, Enzyme won’t consider the child elements for the test.
        
        expect(wrapper.find('form.model-params').exists()).toBeDefined();
        expect(wrapper.find('form.queries-list').exists()).toBeDefined();
        expect(wrapper.find('form.run-job').exists()).toBeDefined();
        expect(wrapper.find('#job-name').exists()).toBeDefined(); 
        expect(wrapper.find('#user-email').exists()).toBeDefined(); 
        expect(wrapper.find('#query-params').exists()).toBeDefined(); 
        expect(wrapper.find('#query-operators').exists()).toBeDefined(); 
        expect(wrapper.find('#query-value').exists()).toBeDefined(); 
        expect(wrapper.find('#target-variable').exists()).toBeDefined(); 
        expect(wrapper.find('#model-type').exists()).toBeDefined(); 

        expect(wrapper.find('#user-email').length).toEqual(1);   // id syntax - searched for email id
        expect(wrapper.find('#job-name').length).toEqual(1); 

        // expect(wrapper.find('#product-amount').length).toEqual(1);  
    })
});

describe('User Email Test Suite', () => {
    it('should change the state of the RunJobForm component', () => {
        const wrapper = shallow(<RunJobForm />);
        // simulate an onChange event (when we enter email input)
        wrapper.find('#user-email').simulate('change',
            {
                target: { value: 'user email' }
            });
        wrapper.update(); // need to re-render the component to see the changes
        expect(wrapper.find('#user-email').prop('value')).toEqual('user email');  // checks that state was changed
    })
});

describe('Job Name Test Suite', () => {
    it('should change the state of the RunJobForm component', () => {
        const wrapper = shallow(<RunJobForm />);
        // simulate an onChange event (when we enter email input)
        wrapper.find('#job-name').simulate('change',
            {
                target: { value: 'job name' }
            });
        wrapper.update(); // need to re-render the component to see the changes
        expect(wrapper.find('#job-name').prop('value')).toEqual('job name');  // checks that state was changed
    })
});
