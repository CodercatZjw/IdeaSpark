import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import WriteIdea from './pages/WriteIdea';
import History from './pages/History';
import InspirationLib from './pages/InspirationLib';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/write" element={<WriteIdea />} />
          <Route path="/write/:id" element={<WriteIdea />} />
          <Route path="/history" element={<History />} />
          <Route path="/inspiration" element={<InspirationLib />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
