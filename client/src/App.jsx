import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import WriteIdea from './pages/WriteIdea';
import History from './pages/History';
import InspirationLib from './pages/InspirationLib';
import Projects from './pages/Projects';
import Graph from './pages/Graph';
import Snippets from './pages/Snippets';
import Tools from './pages/Tools';
import PitchTimer from './pages/PitchTimer';
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
          <Route path="/projects" element={<Projects />} />
          <Route path="/graph" element={<Graph />} />
          <Route path="/snippets" element={<Snippets />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/pitch" element={<PitchTimer />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
