  import { createBrowserRouter, useNavigate } from "react-router-dom";
  import App from "./App";
  import NotFound from "./assets/Shared/NotFound";
  import RegestrationPage from "./assets/Pages/Auth/Regestration";
  import LoginPage from "./assets/Pages/Auth/LoginPage";
  import AppointmentList from "./assets/Pages/Views/AppointmentsList";
  import AppointmentsInfo from "./assets/Components/AppointmentsInfo";
  import ContactUs from "./assets/Pages/Views/ContactUs";
  import AllAppointments from "./dashboard/views/Appointments/AllAppointments";
  import AddAppointment from "./dashboard/views/Appointments/AddAppointment";
  import UpdateAppointment, { UpdateAppointmenyLoader } from "./dashboard/views/Appointments/UpdateAppointment";
  import Dashboard from "./dashboard/Dashboard";
  import Appointments from "./dashboard/views/Appointments/Appointments";
  import AllTravelers from "./dashboard/views/Users/AllTravelers";
  import Traveler from "./dashboard/views/Users/Traveler";
  import AddTraveler from "./dashboard/views/Users/AddTraveler";
  import AppointmentRequests from "./dashboard/views/Requests/AppointmentRequests";
  import Requests from "./dashboard/views/Requests/Request";
  import UpdateRequests from "./dashboard/views/Requests/UpdateRequests";
  import History from "./assets/Pages/Views/UserHistory";
  import Guest from "./assets/middleware/Guest";
  import Admin from "./assets/middleware/Admin";
  import RequestsHistoryUser from "./assets/Pages/Views/RequestsHistoryUser";
import TravelerRequest from "./dashboard/views/Users/TravelerRequest";
import UpdateTraveler from "./dashboard/views/Users/UpdateTraveler";

  export const router = createBrowserRouter([
    {
      path: "",
      element: <App />,
      children: [
        {
          path: "/",
          element: <AppointmentList />,
        },
        {
          element: <Guest />,
          children:[
            {
              path: "/LoginPage",
              element: <LoginPage />,
            },
            {
              path: "/Register",
              element: <RegestrationPage />,
            }
          ]
        },
       
        {
          path: "/requestHistory",
          element: <RequestsHistoryUser />,
        },
        {
          path: "/ContactUs",
          element: <ContactUs />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
        {
          path: "/AppointmentsInfo/:id",
          element: <AppointmentsInfo />,
        },
        {
          path: "/history",
          element: <History />,
        },
      
      ],
    },
   
        {
        path: "/dashboard",
        element:  <Dashboard />,
        children: [

          {
            path: "appointments",
            element: <Appointments />,
            children: [
              {
                index: true,
                element: <AllAppointments />,
              },
              {
                path: "add_appointment",
                element: <AddAppointment />,
              },
              {
                path: "update_appointment/:id",
                loader: UpdateAppointmenyLoader,
                element: <UpdateAppointment />,
              },
            ],
          },
          {
            path: "traveler",
            element: <Traveler />,
            children: [
              {
                index: true,
                element: <AllTravelers />,
              },
              {
                path: "add_traveler",
                element: <AddTraveler />,
              },
              {
                path: "update_traveler/:email",
                element: <UpdateTraveler />,
              },
              {
                path:"traveler_request/:email",
                element:<TravelerRequest />
              }
            ],
          },
          {
            path: "requests",
            element: <Requests />,
            children: [
              {
                index: true,
                element: <AppointmentRequests />,
              },
              {
                path: "update_request/:id",
                loader: UpdateAppointmenyLoader,
                element: <UpdateRequests />,
              },
            ],
          },
        ],
        },
     
    
  ]);