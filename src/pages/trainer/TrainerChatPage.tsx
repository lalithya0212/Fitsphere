import React, { useState, useRef, useEffect } from 'react';
import { useFitSphereStore } from '../../store/useFitSphereStore';
import { UserAvatar } from '../../components/common/UserAvatar';
import {
  Send,
  Sparkles,
  Paperclip,
  CheckCheck,
  Dumbbell,
  Users,
  Search,
  MessageSquare
} from 'lucide-react';

export const TrainerChatPage: React.FC = () => {
  const { chatMessages, sendChatMessage, currentUser, users } = useFitSphereStore();

  const isVerified = currentUser.verificationStatus === 'verified';

  // Filter students assigned to this trainer
  const studentList = isVerified
    ? users.filter(
        u => u.role === 'student' && (u.assignedTrainerId === currentUser.id || u.assignedTrainerName === currentUser.name)
      )
    : [];

  const [selectedStudentId, setSelectedStudentId] = useState(studentList[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (studentList.length > 0 && !studentList.some(s => s.id === selectedStudentId)) {
      setSelectedStudentId(studentList[0].id);
    }
  }, [studentList, selectedStudentId]);

  const activeStudent = studentList.find(s => s.id === selectedStudentId) || studentList[0] || null;

  const threadMessages = activeStudent
    ? chatMessages.filter(
        m => (m.senderId === currentUser.id && m.receiverId === activeStudent.id) ||
             (m.senderId === activeStudent.id && m.receiverId === currentUser.id)
      )
    : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeStudent) return;

    // Trainer sends to student
    useFitSphereStore.setState(state => ({
      chatMessages: [
        ...state.chatMessages,
        {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderRole: 'trainer',
          senderAvatar: '',
          receiverId: activeStudent.id,
          content: inputText.trim(),
          timestamp: new Date().toISOString()
        }
      ]
    }));

    setInputText('');
  };

  return (
    <div className="space-y-4 pb-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
          Athlete Coaching Communication Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Direct messaging with your assigned varsity athletes.
        </p>
      </div>

      {!isVerified ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 border border-amber-200 shadow-sm">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display">Coach Verification Required</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            Your coaching account is awaiting verification by the administrator. Communication channels with student athletes will open once your account is verified and athletes are allocated to you.
          </p>
        </div>
      ) : studentList.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 border border-blue-100">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display">No Athletes Assigned Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            When campus administrators allocate varsity student athletes to your coaching roster, they will appear here for direct communication.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row h-[600px] overflow-hidden">
          {/* Athletes List (Left Sidebar) */}
          <div className="w-full md:w-72 border-r border-slate-200/80 flex flex-col bg-slate-50/50">
            <div className="p-3.5 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Assigned Athletes
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {studentList.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {studentList.map((student) => {
                const isSelected = student.id === selectedStudentId;

                return (
                  <div
                    key={student.id}
                    onClick={() => setSelectedStudentId(student.id)}
                    className={`p-3.5 flex items-center gap-3 cursor-pointer transition-all ${
                      isSelected ? 'bg-white border-l-4 border-l-blue-600 shadow-xs' : 'hover:bg-slate-100/80'
                    }`}
                  >
                    <UserAvatar name={student.name} role="student" size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 truncate">{student.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{student.sportSpecialization || 'Varsity Squad'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chat Thread (Right Panel) */}
          {activeStudent && (
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="p-3.5 px-5 border-b border-slate-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <UserAvatar name={activeStudent.name} role="student" size="sm" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{activeStudent.name}</h3>
                    <p className="text-[10px] text-slate-500">
                      {activeStudent.sportSpecialization || 'Varsity'} • Score: {activeStudent.fitnessScore || 0}%
                    </p>
                  </div>
                </div>

                <div className="text-xs text-amber-700 font-bold">
                  ⭐ {activeStudent.fitCredits || 0} Credits
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
                {threadMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <MessageSquare className="w-10 h-10 text-slate-300 mb-2" />
                    <h4 className="text-xs font-bold text-slate-700">No Messages Yet</h4>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                      Send a coaching cue, workout feedback, or check-in to start the conversation with {activeStudent.name}.
                    </p>
                  </div>
                ) : (
                  threadMessages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;

                    return (
                      <div
                        key={msg.id}
                        className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isMe && (
                          <UserAvatar name={msg.senderName} role="student" size="sm" />
                        )}

                        <div
                          className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            isMe
                              ? 'bg-blue-600 text-white rounded-br-xs shadow-md shadow-blue-600/10'
                              : 'bg-white text-slate-900 rounded-bl-xs border border-slate-200/80 shadow-xs'
                          }`}
                        >
                          {!isMe && (
                            <div className="text-[10px] font-bold text-emerald-700 mb-1">
                              {msg.senderName}
                            </div>
                          )}
                          <p>{msg.content}</p>
                          <div
                            className={`text-[10px] mt-1.5 flex items-center justify-end gap-1 ${
                              isMe ? 'text-blue-200' : 'text-slate-400'
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

              {/* Input */}
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder={`Send coaching feedback to ${activeStudent.name}...`}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="btn-navy text-xs px-4 py-2.5 disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
