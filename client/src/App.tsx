// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
import Home from './components/Home'; // Create a Home component

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/" element={<Home />} />
          <Route path="/signout" element={<SignOut />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
