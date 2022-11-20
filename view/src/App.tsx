import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './components/structures/layout';
import Login from './pages/auth/login';
import Dashboard from './pages/dashboard';
import ManageChecklistIndex from './pages/manage/checklist';
import ManageChecklistCreate from './pages/manage/checklist/create';
import ManageChecklistShow from './pages/manage/checklist/show';
import ManageGroupIndex from './pages/manage/group';
import ManageGroupCreate from './pages/manage/group/create';
import ManageGroupEdit from './pages/manage/group/edit';
import ManageGroupEditPermission from './pages/manage/group/edit-permission';
import ManageGroupShow from './pages/manage/group/show';
import ManageProjectIndex from './pages/manage/project';
import ManageProjectCreate from './pages/manage/project/create';
import ManageProjectEdit from './pages/manage/project/edit';
import ManageProjectShow from './pages/manage/project/show';
import ManageUserIndex from './pages/manage/user';
import ManageUserCreate from './pages/manage/user/create';
import ManageUserEdit from './pages/manage/user/edit';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="auth">
            <Route path="login" element={<Login />} />
          </Route>
          <Route path="users">
            <Route index element={<ManageUserIndex />} />
            <Route path="create" element={<ManageUserCreate />} />
            <Route path=":id/edit" element={<ManageUserEdit />} />
          </Route>

          <Route path="groups">
            <Route index element={<ManageGroupIndex />} />
            <Route path="create" element={<ManageGroupCreate />} />
            <Route path=":id" element={<ManageGroupShow />} />
            <Route path=":id/edit" element={<ManageGroupEdit />} />
            <Route
              path=":id/edit-permission"
              element={<ManageGroupEditPermission />}
            />
          </Route>

          <Route path="checklists">
            <Route index element={<ManageChecklistIndex />} />
            <Route path=":id" element={<ManageChecklistShow />} />
            <Route path="create" element={<ManageChecklistCreate />} />
          </Route>

          <Route path="projects">
            <Route index element={<ManageProjectIndex />} />
            <Route path="create" element={<ManageProjectCreate />} />
            <Route path=":id" element={<ManageProjectShow />} />
            <Route path=":id/edit" element={<ManageProjectEdit />} />
          </Route>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
