import { StrictMode, Suspense } from 'react'
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/buy",
    element: <Buy />,
  },
  {
    path: "/book",
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
    <RouterProvider router={router} />
  </StrictMode>
)
