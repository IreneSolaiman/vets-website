import '../common';
import '../../sass/rx/rx.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';

import initReact from '../common/init-react';
import routes from './routes';
import reducer from './reducers';
import createCommonStore, { renderCommonComponents } from '../common/store';

const store = createCommonStore(reducer);
renderCommonComponents(store);

const history = useRouterHistory(createHistory)({
  basename: '/health-care/prescriptions'
});

function init() {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={history} routes={routes}/>
    </Provider>
  ), document.getElementById('react-root'));
}

initReact(init);
