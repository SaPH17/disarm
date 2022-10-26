import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/login';
import Dashboard from './pages/dashboard';
import Layout from './components/structures/layout';
import ManageUserIndex from './pages/manage/user';
import ManageUserCreate from './pages/manage/user/create';
import ManageProjectCreate from './pages/manage/project/create';
import ManageProjectIndex from './pages/manage/project';
import ManageProjectShow from './pages/manage/project/show';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="auth">
            <Route path="login" element={<Login />} />
          </Route>
          <Route path="manage">
            <Route path="user">
              <Route index element={<ManageUserIndex />} />
              <Route path="create" element={<ManageUserCreate />} />
            </Route>
            <Route path="project">
              <Route index element={<ManageProjectIndex />} />
              <Route path="create" element={<ManageProjectCreate />} />
              <Route path=":id" element={<ManageProjectShow />} />
            </Route>
          </Route>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
