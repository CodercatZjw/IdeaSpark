import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGraph } from '../api';

const CANVAS_W = 900;
const CANVAS_H = 600;
const NODE_R = 28;

export default function Graph() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const navigate = useNavigate();

  // Load data and init positions
  useEffect(() => {
    fetchGraph().then(data => {
      if (data.nodes.length === 0) return;
      const cx = CANVAS_W / 2;
      const cy = CANVAS_H / 2;
      const r = Math.min(cx, cy) * 0.7;
      const initNodes = data.nodes.map((n, i) => {
        const angle = (2 * Math.PI * i) / data.nodes.length - Math.PI / 2;
        return { ...n, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), vx: 0, vy: 0 };
      });
      setNodes(initNodes);
      setEdges(data.edges);
    });
  }, []);

  // Force simulation
  const simRef = useRef(null);
  simRef.current = useCallback(() => {
    setNodes(prev => {
      if (prev.length === 0) return prev;
      const next = prev.map(n => ({ ...n }));
      const cx = CANVAS_W / 2;
      const cy = CANVAS_H / 2;
      const repulsion = 8000;
      const attraction = 0.005;
      const damping = 0.6;

      // repulsion between all nodes
      for (let i = 0; i < next.length; i++) {
        for (let j = i + 1; j < next.length; j++) {
          const dx = next[j].x - next[i].x;
          const dy = next[j].y - next[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = repulsion / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          next[i].vx -= fx; next[i].vy -= fy;
          next[j].vx += fx; next[j].vy += fy;
        }
      }

      // attraction along edges
      for (const edge of edges) {
        const src = next.find(n => n.id === edge.source);
        const tgt = next.find(n => n.id === edge.target);
        if (!src || !tgt) continue;
        const dx = tgt.x - src.x;
        const dy = tgt.y - src.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const fx = dx * attraction * dist;
        const fy = dy * attraction * dist;
        src.vx += fx; src.vy += fy;
        tgt.vx -= fx; tgt.vy -= fy;
      }

      // center gravity + damping + bounds
      for (const n of next) {
        n.vx += (cx - n.x) * 0.001;
        n.vy += (cy - n.y) * 0.001;
        n.vx *= damping;
        n.vy *= damping;
        n.x += n.vx;
        n.y += n.vy;
        n.x = Math.max(NODE_R, Math.min(CANVAS_W - NODE_R, n.x));
        n.y = Math.max(NODE_R, Math.min(CANVAS_H - NODE_R, n.y));
      }

      return next;
    });
  }, [edges]);

  useEffect(() => {
    const tick = () => {
      if (simRef.current) simRef.current();
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_W * dpr;
    canvas.height = CANVAS_H * dpr;
    canvas.style.width = CANVAS_W + 'px';
    canvas.style.height = CANVAS_H + 'px';
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Edges
    for (const edge of edges) {
      const src = nodes.find(n => n.id === edge.source);
      const tgt = nodes.find(n => n.id === edge.target);
      if (!src || !tgt) continue;
      const alpha = edge.weight > 1 ? 0.3 : 0.12;
      ctx.beginPath();
      ctx.moveTo(src.x, src.y);
      ctx.lineTo(tgt.x, tgt.y);
      ctx.strokeStyle = `rgba(94,106,210,${alpha})`;
      ctx.lineWidth = edge.weight > 1 ? 2 : 1;
      ctx.stroke();
    }

    // Nodes
    for (const n of nodes) {
      const isHovered = hoveredNode === n.id;

      // Glow
      if (isHovered) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, NODE_R + 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(94,106,210,0.12)';
        ctx.fill();
      }

      // Circle
      ctx.beginPath();
      ctx.arc(n.x, n.y, NODE_R, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? 'rgba(94,106,210,0.25)' : 'rgba(255,255,255,0.06)';
      ctx.fill();
      ctx.strokeStyle = isHovered ? 'rgba(94,106,210,0.5)' : 'rgba(255,255,255,0.10)';
      ctx.lineWidth = isHovered ? 2 : 1;
      ctx.stroke();

      // Label
      const label = n.title.length > 6 ? n.title.slice(0, 6) + '..' : n.title;
      ctx.font = '12px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#EDEDEF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, n.x, n.y);

      // Tag count badge
      if (n.tags?.length > 0) {
        ctx.beginPath();
        ctx.arc(n.x + NODE_R - 2, n.y - NODE_R + 2, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#5E6AD2';
        ctx.fill();
        ctx.font = '9px Inter, system-ui, sans-serif';
        ctx.fillStyle = '#fff';
        ctx.fillText(String(n.tags.length), n.x + NODE_R - 2, n.y - NODE_R + 2);
      }
    }
  }, [nodes, edges, hoveredNode]);

  const getNodeAt = (mx, my) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    const x = (mx - rect.left) * scaleX;
    const y = (my - rect.top) * scaleY;
    return nodes.find(n => Math.hypot(n.x - x, n.y - y) < NODE_R) || null;
  };

  const handleMouseDown = (e) => {
    const node = getNodeAt(e.clientX, e.clientY);
    if (node) setDragging(node.id);
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = CANVAS_W / rect.width;
      const scaleY = CANVAS_H / rect.height;
      setNodes(prev => prev.map(n =>
        n.id === dragging
          ? { ...n, x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY, vx: 0, vy: 0 }
          : n
      ));
    } else {
      const node = getNodeAt(e.clientX, e.clientY);
      setHoveredNode(node ? node.id : null);
      canvasRef.current.style.cursor = node ? 'pointer' : 'default';
    }
  };

  const handleMouseUp = () => setDragging(null);

  const handleClick = (e) => {
    const node = getNodeAt(e.clientX, e.clientY);
    if (node) navigate(`/write/${node.id}`);
  };

  return (
    <div>
      <div className="row-between" style={{ marginBottom: 32 }}>
        <div>
          <p className="section-label">图谱</p>
          <h1 className="section-title">想法关联图谱</h1>
        </div>
        <p style={{ fontSize: 13, color: 'var(--foreground-subtle)', maxWidth: 220, textAlign: 'right', lineHeight: 1.5 }}>
          节点大小代表标签数，连线表示共享标签。拖拽移动，点击跳转。
        </p>
      </div>

      <div className="card" style={{ padding: 12, overflow: 'hidden' }}>
        {nodes.length === 0 ? (
          <div className="empty-state" style={{ padding: 60 }}>
            <p>还没有足够的想法来生成图谱</p>
          </div>
        ) : (
          <canvas ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleClick}
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }}
          />
        )}
      </div>

      {edges.length > 0 && (
        <div className="card" style={{ marginTop: 16 }}>
          <h2>关联详情</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {edges.sort((a, b) => b.weight - a.weight).slice(0, 12).map((e, i) => {
              const src = nodes.find(n => n.id === e.source);
              const tgt = nodes.find(n => n.id === e.target);
              return (
                <div key={i} className="row" style={{ gap: 10, fontSize: 14 }}>
                  <span style={{ color: 'var(--foreground)', fontWeight: 500 }}>{src?.title}</span>
                  <span style={{ color: 'var(--foreground-subtle)' }}>&mdash;</span>
                  <span style={{ color: 'var(--foreground)', fontWeight: 500 }}>{tgt?.title}</span>
                  <span style={{ fontSize: 12 }}>
                    {e.tags.map(t => <span key={t} className="tag">{t}</span>)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
