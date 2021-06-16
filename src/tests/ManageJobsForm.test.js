import React from 'react';
import { shallow, mount, render } from '../enzyme';
import ManageJobsForm from '../components/ManageJobsForm';
import Report from '../components/Report';


it('renders without crashing', () => {
    shallow(<ManageJobsForm />);
  });


describe('ManageJobsForm Test Suite', () => {
    // checking if the form elements exist.
    it('should render the form', () => {
        const wrapper = shallow(<ManageJobsForm />);  // shallow renders a single component each time. In other words, Enzyme won’t consider the child elements for the test.
        expect(wrapper.find('form.manage-jobs').exists()).toBeDefined();
        expect(wrapper.find('#user-email').exists()).toBeDefined(); 
        expect(wrapper.find('#user-email').length).toEqual(1);
    })
});

describe('User Email Test Suite', () => {
    it('should change the state of the RunJobForm component', () => {
        const wrapper = shallow(<ManageJobsForm />);
        // simulate an onChange event (when we enter email input)
        wrapper.find('#user-email').simulate('change',
            {
                target: { value: 'user email' }
            });
        wrapper.update(); // need to re-render the component to see the changes
        expect(wrapper.find('#user-email').prop('value')).toEqual('user email');  // checks that state was changed
    })
});


describe('Child Component Renders Test Suite', () => {
    it('check if component renders', () => {
        const wrapper = shallow(<ManageJobsForm />);
        expect(wrapper.containsMatchingElement(<Report />)).toEqual(true);
    })
});



