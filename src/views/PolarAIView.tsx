import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  GraduationCap,
  BookOpen,
  Users,
  Compass,
  FileText,
  Database,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { RESEARCH_REPORTS, DATASETS, CLAIMS } from '../data/mockData';
import { ViewMode } from '../types';

interface PolarAIViewProps {
  initialQuery?: string;
  onNavigate: (view: ViewMode, id?: string) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: { title: string; type: string; id: string }[];
  mode?: string;
}

export const PolarAIView: React.FC<PolarAIViewProps> = ({ initialQuery = '', onNavigate }) => {
  const [mode, setMode] = useState<'student' | 'research' | 'teacher' | 'public'>('research');
  const [input, setInput] = useState(initialQuery);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Welcome to **Polar AI** — the retrieval-augmented intelligence layer for POLARSETU. Every response is strictly grounded in peer-reviewed polar publications, NCPOR expedition logs, and satellite observations. How can I assist your polar research today?',
      citations: [
        {
          title: 'NCPOR Indian Antarctic Science Compendium',
          type: 'Repository',
          id: 'report-1',
        },
      ],
    },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const samplePrompts = [
    'Explain the accelerated ice shelf melting in the Indian sector',
    'Why do polar bears and penguins never live in the same place?',
    'What are the key differences between Maitri and Bharati stations?',
    'Is Antarctica getting warmer everywhere or only in West Antarctica?',
  ];

  const handleSend = (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isGenerating) return;

    const userMsg: Message = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsGenerating(true);

    // Simulate RAG retrieval and response generation
    setTimeout(() => {
      let reply = '';
      let citations: { title: string; type: string; id: string }[] = [];

      const lower = textToSend.toLowerCase();

      if (lower.includes('melt') || lower.includes('ice shelf')) {
        reply =
          mode === 'student'
            ? 'Think of ice shelves as floating giant shelves that stop heavy glaciers on land from sliding into the sea. In the Indian sector of Antarctica, warmer ocean water underneath the ice is melting them from below, which allows land glaciers to speed up.'
            : 'Based on phase-sensitive radar (pRES) sounding and CryoSat-2 altimetry from the 43rd Indian Antarctic Expedition, basal melt rates at Nivlisen and Amery ice tongues have accelerated by 18.4%. Warm Circumpolar Deep Water (CDW) pulses shallower than 450m were recorded breaching the continental shelf.';
        citations = [
          {
            title: 'Accelerated Ice Shelf Melting in the Indian Sector (Nair et al., 2025)',
            type: 'Research Paper',
            id: 'report-1',
          },
          {
            title: 'Antarctic Ice Shelf Basal Melt Rates (1995–2025)',
            type: 'Dataset',
            id: 'data-ice-melt',
          },
        ];
      } else if (lower.includes('bear') || lower.includes('penguin')) {
        reply =
          'Polar bears and emperor penguins do not inhabit the same territories. Polar bears (Ursus maritimus) live exclusively in the Arctic in the northern hemisphere, while penguins are native almost entirely to the southern hemisphere (Antarctica and sub-Antarctic islands).';
        citations = [
          {
            title: 'SCAR / IUCN Polar Ecology Database',
            type: 'Fact Check',
            id: 'claim-3',
          },
        ];
      } else if (lower.includes('station') || lower.includes('maitri') || lower.includes('bharati')) {
        reply =
          'India operates two active year-round permanent stations in Antarctica: **Maitri** (established in 1989 in the rocky Schirmacher Oasis at 70°46′S, 11°44′E) and **Bharati** (commissioned in 2012 in the Larsemann Hills at 69°24′S, 76°11′E). Both stations maintain winter-over crews running atmospheric lidar, seismology, and ice-core sampling.';
        citations = [
          {
            title: 'Ministry of Earth Sciences Annual Expedition Records',
            type: 'Expedition Log',
            id: 'exp-43',
          },
        ];
      } else {
        reply =
          `According to POLARSETU's verified scientific repository: Regarding "${textToSend}", multidecadal observations indicate distinct environmental gradients. Our repository provides datasets across meteorological records, CTD salinity transects, and biological surveys from Indian polar expeditions.`;
        citations = [
          {
            title: '43rd Indian Scientific Expedition Synthesis',
            type: 'Research Paper',
            id: 'report-1',
          },
        ];
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: reply,
          citations,
          mode,
        },
      ]);
      setIsGenerating(false);
    }, 700);
  };

  return (
    <div id="polar-ai-view" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cyan-950 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-white font-['Outfit']">
              Polar AI Scientific Intelligence
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Retrieval-Augmented Generation strictly grounded in verified Indian polar research.
          </p>
        </div>

        {/* 4 MODES TOGGLE */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#08172c] border border-cyan-900/60 text-xs">
          {[
            { id: 'student', label: 'Student', icon: GraduationCap },
            { id: 'research', label: 'Research', icon: BookOpen },
            { id: 'teacher', label: 'Teacher', icon: Sparkles },
            { id: 'public', label: 'Public', icon: Users },
          ].map((m) => {
            const Icon = m.icon;
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id as any)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-3xl p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                msg.role === 'user'
                  ? 'bg-cyan-600 text-slate-950 font-medium'
                  : 'bg-[#08172c] border border-cyan-900/70 text-slate-200'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-cyan-950 text-xs text-cyan-400 font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Polar AI ({msg.mode || mode} Mode)</span>
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Verified Citations Chips */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-2 border-t border-cyan-950/80 space-y-1">
                  <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                    Grounded Repository Citations:
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {msg.citations.map((c, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          c.type === 'Dataset'
                            ? onNavigate('datasets')
                            : c.type === 'Fact Check'
                            ? onNavigate('claims')
                            : onNavigate('reports')
                        }
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/50 text-[11px] text-cyan-200 font-medium cursor-pointer transition-colors"
                      >
                        <FileText className="w-3 h-3 text-cyan-400" />
                        <span>{c.title}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 animate-pulse p-3 bg-[#08172c] rounded-xl border border-cyan-900/50 max-w-sm">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Retrieving verified polar sources & formulating response...</span>
          </div>
        )}
      </div>

      {/* Prompt Suggestions */}
      <div className="py-2 flex flex-wrap gap-1.5 overflow-x-auto text-xs">
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-200 text-[11px] transition-colors cursor-pointer whitespace-nowrap"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="pt-2 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask Polar AI (${mode} mode)...`}
          className="flex-1 px-4 py-3 rounded-xl bg-[#08172c] border border-cyan-900/80 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400 shadow-xl"
        />
        <button
          type="submit"
          disabled={!input.trim() || isGenerating}
          className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-sm flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
};
