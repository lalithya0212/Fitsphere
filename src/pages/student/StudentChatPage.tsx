import React, { useState, useRef, useEffect } from 'react';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import { Link } from 'react-router-dom';
import { UserAvatar } from '../../components/common/UserAvatar';
import {
  Send,
  Sparkles,
  Paperclip,
  CheckCheck,
  Dumbbell,
  ShieldCheck,
  Clock,
  MessageSquare
} from 'lucide-react';

export const StudentChatPage: React.FC = () => {
  const { chatMessages, sendChatMessage, currentUser, users } = useFitSphereStore();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const myTrainer = currentUser.assignedTrainerId
    ? users.find(u => u.id === currentUser.assignedTrainerId)
    : null;

  const myMessages = myTrainer
    ? chatMessages.filter(
        m => (m.senderId === currentUser.id && m.receiverId === myTrainer.id) ||
             (m.senderId === myTrainer.id && m.receiverId === currentUser.id)
      )
    : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [myMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !myTrainer) return;
    sendChatMessage(inputText.trim(), myTrainer.id);
    setInputText('');
  };

  const handleQuickChip = (text: string) => {
    if (!myTrainer) return;
    sendChatMessage(text, myTrainer.id);
  };

  const quickChips = [
    "Coach, check my sprint start form",
    "Should I do 3 or 4 sets of Nordic curls today?",
    "Hamstrings feel tight, recommended recovery drill?",
    "Will today's workout count for the Inter-College Cup?"
  ];

  if (!myTrainer) {
    return (
      <div className="space-y-4 pb-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
            Coach Direct Messaging
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Collegiate communication channel with your assigned faculty coach.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-10 border border-slate-200/80 text-center space-y-4 max-w-lg mx-auto mt-8 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 mx-auto flex items-center justify-center text-amber-600 shadow-sm">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-display">No Faculty Coach Assigned</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              You do not currently have an assigned faculty coach. Once the campus athletic administration allocates a coach to your athlete profile, your direct communication channel will open here.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/student/trainer"
              className="btn-secondary text-xs py-2.5 px-4 font-bold inline-block"
            >
              Check Coach Allocation Status
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <UserAvatar
              name={myTrainer.name}
              role="trainer"
              avatar={myTrainer.avatar}
              size="lg"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">{myTrainer.name}</h2>
              <span className="badge-blue text-[10px] font-bold">Verified Coach</span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <span>{myTrainer.sportSpecialization || 'Varsity Conditioning'}</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">Online & Active</span>
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Response time: ~2 mins</span>
        </div>
      </div>

      {/* Chat Thread Box */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col h-[520px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
          <div className="text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
              Encrypted Collegiate Athletic Channel
            </span>
          </div>

          {myMessages.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 mx-auto flex items-center justify-center text-slate-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-slate-800">No Messages Yet</h4>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Send a message to {myTrainer.name} about your workouts, drill telemetry, or competition prep.
              </p>
            </div>
          ) : (
            myMessages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <UserAvatar
                      name={msg.senderName}
                      role={msg.senderRole}
                      avatar={msg.senderAvatar}
                      size="sm"
                      className="mb-1 shrink-0"
                    />
                  )}

                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-br-xs shadow-md shadow-emerald-600/10'
                        : 'bg-white text-slate-900 rounded-bl-xs border border-slate-200/80 shadow-xs'
                    }`}
                  >
                    {!isMe && (
                      <div className="text-[10px] font-bold text-blue-600 mb-1">
                        {msg.senderName}
                      </div>
                    )}
                    <p>{msg.content}</p>
                    <div
                      className={`text-[10px] mt-1.5 flex items-center justify-end gap-1 ${
                        isMe ? 'text-emerald-200' : 'text-slate-400'
                      }`}
                    >
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMe && <CheckCheck className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Inquiry Chips */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Quick Inquiries:
          </span>
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickChip(chip)}
              className="text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 px-3 py-1 rounded-full whitespace-nowrap transition-colors shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={`Type message to ${myTrainer.name}...`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="btn-primary text-xs px-4 py-2.5 disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
