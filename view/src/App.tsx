import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/login';
import Dashboard from './pages/dashboard';
import Layout from './components/structures/layout';
import ManageUserIndex from './pages/manage/user';
import ManageUserCreate from './pages/manage/user/create';

function App() {
  return (
    <Layout>
      <Router>
        <Routes>
          <Route path="auth">
            <Route path="login" element={<Login />} />
          </Route>
          <Route path="manage">
            <Route path="user">
              <Route index element={<ManageUserIndex />} />
              <Route path='create' element={<ManageUserCreate />} />
            </Route>
          </Route>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </Layout>
  );
}

export default App;
