import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Pages/Home/Home.jsx'
import Login from './Pages/Authentication/Login.jsx'
import Signup from './Pages/Authentication/Signup.jsx'
import { Provider } from 'react-redux'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { store } from './Store/store.js'
import Profile from './Pages/Profile/Profile.jsx';
import AdminLogin from './Pages/Admin/AdminLogin.jsx';
import AdminDashboard from './Pages/Admin/AdminDashboard.jsx';
import UserManagement from './Pages/Admin/UserManagement.jsx';



const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },

  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },

  {
    path: "/login",
    element:
      <Login />
  },
  {
    path: "/signup",
    element:
      <Signup />
  },
   {
    path: "/admin/login",
    element: <AdminLogin />
  },
   {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/users",
    element: <UserManagement />,
  },
])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>

    <App />
    <RouterProvider router={router} />

  </Provider>


);
