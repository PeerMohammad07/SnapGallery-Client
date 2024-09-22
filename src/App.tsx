import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoutes from './Routes/PrivateRoutes';
// import PrivateRoutes from './Routes/PrivateRoutes';

const App = () => {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />
    }, {
      path: "/login",
      element: (
        <PrivateRoutes>
          <Login />
        </PrivateRoutes>
      ),
    },
    {
      path: "/register",
      element: (
        <PrivateRoutes>
          <Register />
        </PrivateRoutes>
      ),
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;