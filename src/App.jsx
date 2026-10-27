import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import AppLayout from "./AppLayout";
import Overview from "./Pages/Overview";
import Activedevices from "./Pages/Devices";
import Homepage from "./Layout/Homepage";
import SelectedDevice from "./Pages/SelectedDevice";
import { AuthProvider } from "./Context/TerminalProvider";
import { Toaster } from "react-hot-toast";
import ConfirmationPage from "./Layout/ConfirmationPage";

const App = () => {

  
 const route = createBrowserRouter([
    {
      path: '/',
      element: <AppLayout/>,
      children: [
          {
        index: true,
        element: <Navigate to={'/overview'} replace/>
      },
     {
      path: 'overview',
      element: <Overview/>
    },
    {
      path: 'selecteddevice/:id',
      element: <SelectedDevice/>
    },
    {
      path: 'activedevices',
      element: <Activedevices/>
    },
      ]
    }
 ])

  return (
  <div className="bg-slate-200 min-h-screen">
<Toaster
  position="top-center"
  gutter={8}
  toastOptions={{
    duration: 3000,
    style: {
      background: "#0f172a",
      color: "#f8fafc",
      borderRadius: "9999px",
      padding: "10px 18px",
      fontSize: "14px",
      fontWeight: 500,
      boxShadow: "0 10px 25px rgba(15, 23, 42, 0.25)",
    },
    success: {
      iconTheme: { primary: "#22c55e", secondary: "#0f172a" },
    },
    error: {
      iconTheme: { primary: "#f87171", secondary: "#0f172a" },
    },
  }}
/>
    <AuthProvider>
      <RouterProvider router={route} />
    </AuthProvider>
  </div>
);
};

export default App;