import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@material-tailwind/react";
import "../public/css/tailwind.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Home, Profile, SignIn, SignUp } from "./pages";
import BuyProject from "./Components/GServices/buyProject";
import PaymentSuccess from "./Components/GServices/PaymentSucces";
import ServiceDetails from "./Components/GServices/serviceDetails";
import ErrorPage from "./Components/GServices/ErrorPage";
import Cart from "./Components/GServices/Cart";
import SearchResults  from "./Components/GServices/SearchResults";
import Checkout   from "./Components/GServices/Checkout";
import CommandeSucces   from "./Components/GServices/CommandeSucces";
import WelcomePage from "./Components/Authentification/WelcomePage";
import { LanguageProvider } from "@/pages/LanguageContext";
import i18n from "@/Components/GServices/i18n"; 
import { AuthProvider } from './pages/authContext';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
     
      { path: "/consultation", element: <Profile /> },
      { path: "/profile/:idUser", element: <Profile /> },
      { path: "/productDetails/:id", element: <ServiceDetails /> },
    
      { path: "/sign-in", element: <SignIn /> },
      { path: "/sign-up", element: <SignUp /> },
      { path: "/store", element: <BuyProject /> },
      { path: "/cart", element: <Cart /> },
      { path: "/search", element: <SearchResults  /> },
      { path: "/checkout", element: <Checkout  /> },
    ]
  },

  { path: "/paymentSucces", element: <PaymentSuccess /> },
  { path: "/commandeSucces", element: <CommandeSucces /> },
  {
    path: "/errorpage",
    element: <ErrorPage />
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <AuthProvider>
    <ThemeProvider>
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);