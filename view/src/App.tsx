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
import ManageGroupIndex from './pages/manage/group';
import ManageChecklistIndex from './pages/manage/checklist';
import ManageChecklistShow from './pages/manage/checklist/show';
import ManageFindingIndex from './pages/manage/finding';

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

            <Route path="group">
              <Route index element={<ManageGroupIndex />} />
            </Route>

            <Route path="checklist">
              <Route index element={<ManageChecklistIndex />} />
              <Route path=":id" element={<ManageChecklistShow />} />
            </Route>

            <Route path="finding">
              <Route index element={<ManageFindingIndex />} />
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
