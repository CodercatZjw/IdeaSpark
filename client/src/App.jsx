import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import WriteIdea from './pages/WriteIdea';
import History from './pages/History';
import InspirationLib from './pages/InspirationLib';
import Navbar from './components/Navbar';

function BackgroundSystem() {
  return (
    <div className="bg-system" aria-hidden="true">
      <div className="bg-base-layer" />
      <div className="bg-noise" />
      <div className="bg-grid" />
      <div className="bg-blob bg-blob--primary" />
      <div className="bg-blob bg-blob--secondary" />
      <div className="bg-blob bg-blob--tertiary" />
      <div className="bg-blob bg-blob--accent" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <BackgroundSystem />
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
