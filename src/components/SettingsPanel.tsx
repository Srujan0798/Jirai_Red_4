
import React, { useState, useRef } from 'react';
import { X, User, Bell, Shield, Sliders, Info, LogOut, Volume2, VolumeX, Moon, Check } from 'lucide-react';
import { useNodesStore } from '../stores/nodesStore';
import { useUserStore } from '../stores/userStore';
import { useToastStore } from '../stores/toastStore';
import { Z_INDEX, STORAGE_KEYS } from '../constants';
import { getInitialState } from '../utils/initialState';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'general' | 'profile' | 'preferences' | 'about';

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  
  // Stores
  const { layoutPreference, setLayoutPreference, setGraph } = useNodesStore();
  const { profile, preferences, updateProfile, updatePreferences } = useUserStore();
  const { addToast } = useToastStore();
  
  const avatarInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // --- Handlers ---

  const handleReset = () => {
      if (confirm('Are you sure you want to reset your workspace? This will clear all nodes and edges.')) {
          const { nodes, edges } = getInitialState();
          setGraph(nodes, edges);
          addToast({ type: 'success', title: 'Workspace Reset', message: 'Canvas has been restored to default.' });
          onClose();
      }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              updateProfile({ avatar: reader.result as string });
              addToast({ type: 'success', title: 'Profile Updated', message: 'New avatar uploaded successfully.' });
          };
          reader.readAsDataURL(file);
      }
  };

  const handleReplayTutorial = () => {
      localStorage.removeItem(STORAGE_KEYS.TUTORIAL_COMPLETED);
      window.location.reload();
  };

  // --- Renderers ---

  const TabButton = ({ id, icon: Icon, label }: { id: SettingsTab, icon: any, label: string }) => (
      <button
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
            activeTab === id 
            ? 'bg-[#FF4F5E]/10 text-[#FF4F5E]' 
            : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
        }`}
      >
          <Icon size={18} />
          {label}
      </button>
  );

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#181B21] border border-[#2D313A] rounded-2xl w-full max-w-4xl h-[80vh] shadow-2xl flex overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-64 bg-[#0F1115] border-r border-[#2D313A] flex flex-col">
            <div className="p-6 border-b border-[#2D313A]">
                <h2 className="text-lg font-bold text-white">Settings</h2>
                <p className="text-xs text-gray-500">Manage your workspace</p>
            </div>
            <div className="flex-1 p-4 space-y-1">
                <TabButton id="general" icon={Sliders} label="General" />
                <TabButton id="profile" icon={User} label="Profile" />
                <TabButton id="preferences" icon={Bell} label="Preferences" />
                <TabButton id="about" icon={Info} label="About" />
            </div>
            <div className="p-4 border-t border-[#2D313A]">
                <button onClick={onClose} className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors w-full px-4 py-2">
                    <LogOut size={14} /> Close Settings
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col bg-[#181B21] relative">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <X size={20} />
            </button>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                
                {/* === GENERAL === */}
                {activeTab === 'general' && (
                    <div className="space-y-8 max-w-lg">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Workspace Layout</h3>
                            <p className="text-sm text-gray-400 mb-4">Choose how nodes are automatically arranged.</p>
                            <div className="grid grid-cols-3 gap-3">
                                {(['ORGANIC', 'HORIZONTAL', 'VERTICAL'] as const).map(pref => (
                                    <button
                                        key={pref}
                                        onClick={() => setLayoutPreference(pref)}
                                        className={`p-3 rounded-xl border text-xs font-medium transition-all ${
                                            layoutPreference === pref 
                                            ? 'bg-[#FF4F5E]/20 border-[#FF4F5E] text-white' 
                                            : 'bg-[#0F1115] border-[#2D313A] text-gray-400 hover:border-gray-500'
                                        }`}
                                    >
                                        {pref.charAt(0) + pref.slice(1).toLowerCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-[#2D313A]" />

                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Danger Zone</h3>
                            <p className="text-sm text-gray-400 mb-4">Irreversible actions for your workspace.</p>
                            <div className="space-y-3">
                                <button 
                                    onClick={handleReset}
                                    className="w-full p-4 border border-red-500/20 bg-red-500/5 rounded-xl text-left hover:bg-red-500/10 transition-colors group"
                                >
                                    <span className="block text-sm font-bold text-red-400 group-hover:text-red-300">Reset Workspace</span>
                                    <span className="text-xs text-red-400/60">Clear all data and restore default template.</span>
                                </button>
                                <button 
                                    onClick={handleReplayTutorial}
                                    className="w-full p-4 border border-[#2D313A] bg-[#0F1115] rounded-xl text-left hover:bg-[#2D313A] transition-colors group"
                                >
                                    <span className="block text-sm font-bold text-gray-300 group-hover:text-white">Replay Tutorial</span>
                                    <span className="text-xs text-gray-500">Restart the onboarding experience.</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* === PROFILE === */}
                {activeTab === 'profile' && (
                    <div className="space-y-8 max-w-lg">
                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full bg-[#2D313A] overflow-hidden border-2 border-[#2D313A] group-hover:border-[#FF4F5E] transition-colors">
                                    {profile.avatar ? (
                                        <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                                            <User size={32} />
                                        </div>
                                    )}
                                </div>
                                <button 
                                    onClick={() => avatarInputRef.current?.click()}
                                    className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity"
                                >
                                    Change
                                </button>
                                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{profile.name}</h3>
                                <p className="text-sm text-gray-400">{profile.email || 'No email set'}</p>
                                <span className="inline-block mt-2 px-2 py-0.5 bg-[#FF4F5E]/20 text-[#FF4F5E] text-[10px] font-bold rounded uppercase tracking-wider">
                                    {profile.role}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-gray-500 mb-2">Display Name</label>
                                <input 
                                    type="text" 
                                    value={profile.name}
                                    onChange={(e) => updateProfile({ name: e.target.value })}
                                    className="w-full bg-[#0F1115] border border-[#2D313A] rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#FF4F5E] outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-gray-500 mb-2">Email Address</label>
                                <input 
                                    type="email" 
                                    value={profile.email}
                                    onChange={(e) => updateProfile({ email: e.target.value })}
                                    className="w-full bg-[#0F1115] border border-[#2D313A] rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#FF4F5E] outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-gray-500 mb-2">Role / Title</label>
                                <input 
                                    type="text" 
                                    value={profile.role}
                                    onChange={(e) => updateProfile({ role: e.target.value })}
                                    className="w-full bg-[#0F1115] border border-[#2D313A] rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#FF4F5E] outline-none transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* === PREFERENCES === */}
                {activeTab === 'preferences' && (
                    <div className="space-y-6 max-w-lg">
                        <div className="flex items-center justify-between p-4 bg-[#0F1115] rounded-xl border border-[#2D313A]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                                    <Bell size={18} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">Notifications</h4>
                                    <p className="text-xs text-gray-500">Show toast messages for actions.</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => updatePreferences({ notifications: !preferences.notifications })}
                                className={`w-10 h-5 rounded-full p-0.5 transition-colors ${preferences.notifications ? 'bg-[#FF4F5E]' : 'bg-[#2D313A]'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${preferences.notifications ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-[#0F1115] rounded-xl border border-[#2D313A]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                                    {preferences.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">Sound Effects</h4>
                                    <p className="text-xs text-gray-500">Play sounds for interactions.</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => updatePreferences({ soundEnabled: !preferences.soundEnabled })}
                                className={`w-10 h-5 rounded-full p-0.5 transition-colors ${preferences.soundEnabled ? 'bg-[#FF4F5E]' : 'bg-[#2D313A]'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${preferences.soundEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-[#0F1115] rounded-xl border border-[#2D313A]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                                    <Shield size={18} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">Auto-Save</h4>
                                    <p className="text-xs text-gray-500">Automatically persist workspace.</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => updatePreferences({ autoSave: !preferences.autoSave })}
                                className={`w-10 h-5 rounded-full p-0.5 transition-colors ${preferences.autoSave ? 'bg-[#FF4F5E]' : 'bg-[#2D313A]'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${preferences.autoSave ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                )}

                {/* === ABOUT === */}
                {activeTab === 'about' && (
                    <div className="max-w-lg">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#FF4F5E] to-[#D63F4C] rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-lg shadow-red-900/20 mb-4">
                                ⚓
                            </div>
                            <h2 className="text-2xl font-bold text-white">Jirai</h2>
                            <p className="text-gray-400 text-sm mt-1">Spatial Intelligence Workspace v1.3.0</p>
                        </div>

                        <div className="space-y-4 text-sm text-gray-300">
                            <p>
                                Jirai is a next-generation AI workspace that combines Mind Map Analysis and Timeline Workflows. 
                                Designed for thinkers, planners, and creators who need a fluid canvas for their ideas.
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="p-4 bg-[#0F1115] rounded-xl border border-[#2D313A]">
                                    <h4 className="font-bold text-white mb-1">Privacy First</h4>
                                    <p className="text-xs text-gray-500">Data is stored locally in your browser. Export anytime.</p>
                                </div>
                                <div className="p-4 bg-[#0F1115] rounded-xl border border-[#2D313A]">
                                    <h4 className="font-bold text-white mb-1">AI Powered</h4>
                                    <p className="text-xs text-gray-500">Built with Google Gemini 2.5 Flash for real-time intelligence.</p>
                                </div>
                            </div>

                            <div className="pt-6 mt-6 border-t border-[#2D313A] text-xs text-gray-500 text-center">
                                &copy; {new Date().getFullYear()} Jirai Inc. All rights reserved.
                                <br />
                                <a href="#" className="hover:text-[#FF4F5E] transition-colors">Terms of Service</a> • <a href="#" className="hover:text-[#FF4F5E] transition-colors">Privacy Policy</a>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
};
