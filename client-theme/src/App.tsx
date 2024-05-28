
// src/App.jsx
import React from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import router from './routes/routes';
import store from './store/store';
// import SignOut from './components/SignOut';


const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  );
};

export default App;
