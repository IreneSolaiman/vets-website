import { expect } from 'chai';
import sinon from 'sinon';
import {
  sendFeedback,
  clearError,
  SEND_FEEDBACK,
  FEEDBACK_RECEIVED,
  FEEDBACK_ERROR,
  CLEAR_FEEDBACK_ERROR
} from '../../../src/js/feedback/actions';

describe('sendFeedback', () => {

  const dispatch = sinon.spy();
  const old = { sessionStorage: global.sessionStorage, fetch: global.fetch };
  const fetchResponse = {
    ok: true,
    json() {},
    headers: {
      get: key => ({ 'content-type': 'application/json' }[key])
    }
  };
  const fetch = sinon.spy(() => Promise.resolve(fetchResponse));
  const state = {
    feedback: {
      requestPending: false,
      feedbackReceived: false,
      errorMessage: null,
      formIsVisible: false,
      formHasValidated: false,
      formValues: {
        description: '',
        email: '',
        shouldSendResponse: false
      },
      formErrors: {
        description: null,
        email: null
      }
    }
  };

  before(() => {
    global.sessionStorage = {};
    global.fetch = fetch;
  });

  after(() => {
    global.fetch = old.fetch;
    global.sessionStorage = old.sessionStorage;
  });

  afterEach(() => {
    fetch.reset();
    dispatch.reset();
  });

  it('dispatches SEND_FEEDBACK and FEEDBACK_RECEIVED when there is a successful request', (done) => {

    const getState = () => state;
    const actionCreator = sendFeedback();
    const result = actionCreator(dispatch, getState);

    result.then(() => {

      expect(fetch.calledOnce).to.be.true;
      expect(dispatch.calledTwice).to.be.true;

      const firstAction = dispatch.args[0][0];
      const secondAction = dispatch.args[1][0];

      expect(firstAction.type).to.equal(SEND_FEEDBACK);
      expect(secondAction.type).to.equal(FEEDBACK_RECEIVED);

    }).then(done, done);
  });

  it('dispatches FEEDBACK_ERROR when response.ok is false', (done) => {
    fetchResponse.ok = false;

    const getState = () => state;
    const actionCreator = sendFeedback({ description: 'My feedback description', email: 'test@test.com' });
    const result = actionCreator(dispatch, getState);

    result.then(() => {

      expect(fetch.calledOnce).to.be.true;
      expect(dispatch.calledTwice).to.be.true;

      const firstAction = dispatch.args[0][0];
      const secondAction = dispatch.args[1][0];

      expect(firstAction.type).to.equal(SEND_FEEDBACK);
      expect(secondAction.type).to.equal(FEEDBACK_ERROR);
      expect(secondAction.message).to.be.a('string');

    }).then(done, done);
  });
});

describe('clearError', () => {
  it('returns type CLEAR_FEEDBACK_ERROR', () => {
    const result = clearError();
    expect(result.type).to.equal(CLEAR_FEEDBACK_ERROR);
  });
});
