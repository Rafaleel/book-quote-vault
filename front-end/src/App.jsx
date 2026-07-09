import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Gallery from './pages/Gallery';
import BookDetails from './pages/BookDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Gallery />} />
          <Route path="book/:id" element={<BookDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
