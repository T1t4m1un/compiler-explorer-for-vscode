import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './stores';
import { ConfigProvider } from 'antd';

ReactDOM.render(
  <ConfigProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>, document.getElementById('root'));
