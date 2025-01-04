import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import './index.css'
import Home from './Home.tsx'
import Cart from './Cart.tsx'
import Buy from './Buy.tsx'
import AllBook from './Book.tsx'
import { BookInfo } from './Book.tsx'
import Login from './Login.tsx'
import UserInfo from './Userinfo.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/:user/home",
    element: <Home />,
  },
  {
    path: "/:user/info",
    element: <UserInfo />,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/:user/cart",
    element: <Cart />,
  },
  {
    path: "/:user/buy",
    element: <Buy />,
  },
  {
    path: "/:user/book",
    element: <AllBook />,
    children: [
      {
        path: ":bookId",
        element:<BookInfo />,
      },
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
)
