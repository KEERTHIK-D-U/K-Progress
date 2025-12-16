import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Save, User, Mail, Lock } from 'lucide-react';

interface ProfileModalProps {
    onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
    const { user, updateProfile } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        if (password && password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            await updateProfile({ name, email, password });
            setMessage('Profile updated successfully!');
            setTimeout(onClose, 1500); 
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
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

                    <div className="border-t border-gray-100 pt-4">
                         <label className="block text-sm font-medium text-gray-700 mb-1">New Password (Optional)</label>
                         <div className="relative mb-3">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                type="password" 
                                placeholder="New Password"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
                            />
                        </div>
                         <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                type="password" 
                                placeholder="Confirm New Password"
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-gray-900 text-white py-2 rounded-lg font-bold hover:bg-black transition-transform active:scale-95 flex justify-center items-center gap-2">
                        <Save size={18} /> Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileModal;
