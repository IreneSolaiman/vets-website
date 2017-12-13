import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import FeedbackForm from '../../../src/js/feedback/components/FeedbackForm';
import AlertBox from '../../../src/js/common/components/AlertBox';

const defaultProps = {
  formValues: {},
  formErrors: {},
  sendFeedback() {},
  clearError() {},
  setFormValues() {},
  errorMessage: null,
  requestPending: null
};

describe('<FeedbackForm/>', () => {

  it('should render', () => {
    const wrapper = enzyme.shallow(<FeedbackForm {...defaultProps}/>);
    const text = wrapper.text();
    expect(text.includes('Tell us what you think')).to.be.true;
  });

  it('should render with an error message', () => {
    const errorMessage = 'Testing errors';
    const props = { ...defaultProps, errorMessage };
    const wrapper = enzyme.shallow(<FeedbackForm {...props}/>);
    expect(wrapper.find(AlertBox)).to.have.lengthOf(1);
  });

  it('submits the form information', () => {
    const sendFeedback = sinon.spy();
    const props = { ...defaultProps, sendFeedback };
    const wrapper = enzyme.shallow(<FeedbackForm {...props}/>);
    const event = { preventDefault: sinon.spy() };

    wrapper.find('form').simulate('submit', event);

    expect(event.preventDefault.calledOnce).to.be.true;
    expect(sendFeedback.calledOnce).to.be.true;
  });
});
