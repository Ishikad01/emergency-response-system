import React, { useState } from 'react';
import { Bot, Send, Sparkles, MessageSquare, Terminal, AlertCircle, Database, Network } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  "Summarize active emergencies in Delhi Central",
  "Why was this hospital selected for the latest accident?",
  "Which ambulance units are currently available for dispatch?",
  "Explain the recommended route and road blockage bypass",
  "Prioritize current incidents by patient severity and casualty count",
];

export default function CopilotPanel() {
  const [selectedPrompt, setSelectedPrompt] = useState(SUGGESTED_PROMPTS[1]);
  const [inputMessage, setInputMessage] = useState('');
  const [queryLog, setQueryLog] = useState([
    {
      id: 1,
      sender: 'user',
      text: 'Why was Lok Nayak Jai Prakash Hospital (LNJP) selected for the Connaught Place incident?',
    },
    {
      id: 2,
      sender: 'copilot',
      isArchitecturePreview: true,
      text: 'LNJP was selected by the multi-objective optimization formula because it achieved the minimum composite cost score (2.21). Although General Williams Hospital was geographically closer (0.22 km vs 1.84 km), LNJP offered higher available bed capacity (30 open beds vs critical load). The algorithm balanced proximity weight (0.7) against bed congestion ratio (3.0) to avoid emergency room bottlenecks.',
    },
  ]);

  const handleSend = (textToSend) => {
    const prompt = textToSend || inputMessage;
    if (!prompt.trim()) return;

    const newQuery = { id: Date.now(), sender: 'user', text: prompt };
    
    // Honest Architecture Preview Response
    const newReply = {
      id: Date.now() + 1,
      sender: 'copilot',
      isArchitecturePreview: true,
      text: `[Architecture Preview Response]: Query received regarding "${prompt}". In the Planned Final Phase, this interface will connect to a Retrieval-Augmented Generation (RAG) pipeline feeding real-time NetworkX graph telemetry and hospital capacity matrices into an LLM. For this Mid-Term Prototype, please refer to the live calculations displayed in the Map & Routing and Resource Optimization tabs.`,
    };

    setQueryLog((prev) => [...prev, newQuery, newReply]);
    setInputMessage('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="command-card" style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid #334155',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            backgroundColor: 'rgba(236, 72, 153, 0.15)',
            border: '1px solid rgba(236, 72, 153, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f472b6',
          }}>
            <Bot size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Emergency Response Copilot</h2>
              <span className="badge badge-planned">AI Copilot &bull; Planned Final Phase</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Conversational intelligence layer for dispatchers, combining LLM reasoning with live geospatial graph telemetry.
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '5px',
          backgroundColor: 'rgba(236, 72, 153, 0.1)',
          border: '1px solid rgba(236, 72, 153, 0.3)',
        }}>
          <Sparkles size={14} style={{ color: '#f472b6' }} />
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#fbcfe8' }}>
            Interface Specification Preview
          </span>
        </div>
      </div>

      {/* Main Copilot Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px' }}>
        {/* Chat / Query Terminal */}
        <div className="command-card" style={{ display: 'flex', flexDirection: 'column', height: '540px' }}>
          <div style={{
            paddingBottom: '12px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={16} style={{ color: '#38bdf8' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-bright)' }}>
                Dispatcher Telemetry Console
              </span>
            </div>
            <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              LLM_RAG_ABSTRACTION_v1.0
            </span>
          </div>

          {/* Messages Feed */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {queryLog.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div style={{
                  maxWidth: '85%',
                  padding: '12px 14px',
                  borderRadius: msg.sender === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                  backgroundColor: msg.sender === 'user' ? 'rgba(59, 130, 246, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${msg.sender === 'user' ? 'rgba(59, 130, 246, 0.4)' : 'var(--border-subtle)'}`,
                  fontSize: '0.82rem',
                  lineHeight: 1.45,
                  color: msg.sender === 'user' ? '#93c5fd' : '#e2e8f0',
                }}>
                  {msg.isArchitecturePreview && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      color: '#f472b6',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                    }}>
                      <Bot size={12} /> Synthesized Viva Explanation
                    </div>
                  )}
                  <div>{msg.text}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <div style={{
            paddingTop: '14px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            gap: '10px',
          }}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              placeholder="Ask copilot about routing decisions, telemetry, or resource loads..."
              style={{
                flex: 1,
                padding: '10px 14px',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: 'var(--text-bright)',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
            <button
              onClick={() => handleSend()}
              className="btn btn-primary"
              style={{ padding: '0 16px' }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>

        {/* Right Column: Suggested Inquiries & Architecture Blueprint */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Suggested Prompts */}
          <div className="command-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <MessageSquare size={16} style={{ color: '#f59e0b' }} />
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Suggested Viva Evaluation Prompts</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  style={{
                    textAlign: 'left',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-subtle)',
                    color: '#cbd5e1',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#38bdf8';
                    e.currentTarget.style.color = '#38bdf8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.color = '#cbd5e1';
                  }}
                >
                  &ldquo;{prompt}&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* Architecture Blueprint */}
          <div className="command-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Database size={16} style={{ color: '#10b981' }} />
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Planned AI Layer Blueprint</h3>
            </div>

            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.45, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '8px 10px', borderRadius: '4px', backgroundColor: 'var(--bg-main)', borderLeft: '3px solid #3b82f6' }}>
                <strong style={{ color: '#93c5fd' }}>1. Knowledge Retriever:</strong> Vectors over OSMnx graph connectivity, hospital specialty directories, and Delhi-NCR traffic corridors.
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '4px', backgroundColor: 'var(--bg-main)', borderLeft: '3px solid #10b981' }}>
                <strong style={{ color: '#6ee7b7' }}>2. Context Aggregator:</strong> Formats live NetworkX Dijkstra path nodes and bed vacancy matrices into structured JSON prompts.
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '4px', backgroundColor: 'var(--bg-main)', borderLeft: '3px solid #ec4899' }}>
                <strong style={{ color: '#f472b6' }}>3. LLM Reasoning:</strong> Evaluates trade-offs in plain natural language for rapid dispatcher decision support.
              </div>
            </div>

            <div style={{
              marginTop: '14px',
              padding: '8px 10px',
              borderRadius: '5px',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px dashed rgba(239, 68, 68, 0.3)',
              fontSize: '0.68rem',
              color: '#fca5a5',
              lineHeight: 1.3,
            }}>
              <strong>Honesty Notice:</strong> This interface acts as an architectural design preview for the Phase 2 viva. Responses are generated to illustrate how the RAG model will explain routing math.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
