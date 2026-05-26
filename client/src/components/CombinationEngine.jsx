import { useState, useEffect } from 'react';
import { fetchRandomInspiration } from '../api';

export default function CombinationEngine() {
  const [combo, setCombo] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setFlipped(false);
    setLoading(true);
    const data = await fetchRandomInspiration();
    if (data.keywords.length >= 2) {
      setCombo({
        a: data.keywords[0].content,
        b: data.keywords[1].content,
        prompt: data.prompts[0]?.content || '',
      });
    }
    setLoading(false);
    setTimeout(() => setFlipped(true), 150);
  };

  useEffect(() => { generate(); }, []);

  return (
    <div className="card" style={{ marginBottom: 24, overflow: 'visible' }}>
      <div className="row-between" style={{ marginBottom: 20 }}>
        <div>
          <p className="section-label">随机组合引擎</p>
          <h2 style={{ margin: 0 }}>强制联想</h2>
        </div>
        <button className="btn btn-outline btn-sm" onClick={generate} disabled={loading}>
          {loading ? '生成中...' : '再摇一次'}
        </button>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 20, flexWrap: 'wrap', minHeight: 100, perspective: '1000px',
      }}>
        {combo && (
          <>
            <div style={{
              padding: '16px 28px', background: 'rgba(94,106,210,0.10)',
              border: '1px solid rgba(94,106,210,0.25)', borderRadius: 16,
              fontSize: 20, fontWeight: 600, color: 'var(--accent-bright)',
              transform: flipped ? 'rotateY(0deg)' : 'rotateY(90deg)',
              transition: 'transform 400ms var(--ease-expo)',
            }}>
              {combo.a}
            </div>

            <div style={{
              fontSize: 28, fontWeight: 700,
              background: 'linear-gradient(135deg, #5E6AD2, #8B5CF6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              opacity: flipped ? 1 : 0, transition: 'opacity 300ms 200ms var(--ease-expo)',
            }}>
              &times;
            </div>

            <div style={{
              padding: '16px 28px', background: 'rgba(139,92,246,0.10)',
              border: '1px solid rgba(139,92,246,0.25)', borderRadius: 16,
              fontSize: 20, fontWeight: 600, color: '#a78bfa',
              transform: flipped ? 'rotateY(0deg)' : 'rotateY(90deg)',
              transition: 'transform 400ms 100ms var(--ease-expo)',
            }}>
              {combo.b}
            </div>
          </>
        )}
      </div>

      {combo && flipped && (
        <div style={{
          marginTop: 20, textAlign: 'center',
          opacity: flipped ? 1 : 0, transition: 'opacity 400ms 300ms var(--ease-expo)',
        }}>
          <p style={{ fontSize: 14, color: 'var(--foreground-muted)', marginBottom: 8 }}>
            灵感提示
          </p>
          <p style={{
            fontSize: 16, color: 'var(--foreground)', fontStyle: 'italic',
            lineHeight: 1.6, maxWidth: 500, margin: '0 auto',
          }}>
            &ldquo;{combo.prompt}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
