import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail } from 'lucide-react';

interface ProfileModalProps {
    onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
    // Local state management for client-only version
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Load settings from local storage
        const storedName = localStorage.getItem('user_name') || 'User';
        const storedEmail = localStorage.getItem('user_email') || '';
        setName(storedName);
        setEmail(storedEmail);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        try {
            // Save to local storage
            localStorage.setItem('user_name', name);
            localStorage.setItem('user_email', email);
            
            setMessage('Profile updated successfully!');
            // Force reload to update dashboard name if needed, or simple timeout
            setTimeout(() => {
                onClose();
                window.location.reload(); // Simple way to refresh app state
            }, 1000); 
        } catch (error) {
            setMessage('Failed to update profile');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl border border-gray-200 animate-fadeIn">
                <div className="bg-gray-800 p-6 text-white flex justify-between items-center">
                   <h3 className="text-xl font-bold flex items-center gap-2">
                       <User size={20} /> Edit Profile
                   </h3>
                   <button onClick={onClose} className="hover:text-gray-300"><X size={20} /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {message && <p className={`text-center text-sm p-2 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</p>}
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address (Local)</label>
                         <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
                            />
                        </div>
                    </div>
                    
                     <div className="bg-gray-50 p-3 rounded text-xs text-gray-500">
                        Note: This is a client-only mode. Data is saved to your browser.
                    </div>

                    <button type="submit" className="w-full bg-gray-900 text-white py-2 rounded-lg font-bold hover:bg-black transition-transform active:scale-95 flex justify-center items-center gap-2">
                        <Save size={18} /> Save Preferences
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileModal;
