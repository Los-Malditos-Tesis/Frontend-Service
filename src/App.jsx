import React from 'react'
import Providers from './app/providers'
import { router } from './app/router';
import { RouterProvider } from 'react-router-dom';

function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
}

export default App
