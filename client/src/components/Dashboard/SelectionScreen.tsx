
import React from 'react';
import { Calendar, BrainCircuit } from 'lucide-react';

interface SelectionScreenProps {
  onSelect: (mode: 'traditional' | 'modern') => void;
}

const SelectionScreen: React.FC<SelectionScreenProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-ash-gradient flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-black">K Progress</span>
          </h1>
          <p className="text-lg text-gray-500">Choose how you want to manage your tasks today</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional Card */}
          <button
            onClick={() => onSelect('traditional')}
            className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-300 text-left"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Calendar size={120} className="text-gray-400" />
            </div>
            
            <div className="relative z-10">
              <div className="h-14 w-14 rounded-xl bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform bg-ash-gradient border border-gray-100">
                <Calendar size={28} className="text-gray-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Focus Today</h3>
              <p className="text-gray-500 mb-6 font-light">
                Classic daily todo list. Perfect for quick tasks, daily chores, and short-term planning.
              </p>
              <div className="flex items-center text-gray-900 font-semibold group-hover:translate-x-1 transition-transform">
                Start Daily Mode &rarr;
              </div>
            </div>
          </button>

          {/* AI Card */}
          <button
            onClick={() => onSelect('modern')}
            className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-300 text-left overflow-hidden"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <BrainCircuit size={120} className="text-gray-600" />
            </div>

            <div className="relative z-10">
              <div className="h-14 w-14 rounded-xl bg-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-gray-200">
                <BrainCircuit size={28} className="text-gray-800" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Long-term Goals</h3>
              <p className="text-gray-500 mb-6 font-light">
                AI-powered roadmap. Define a goal, and let AI break it down into actionable milestones.
              </p>
              <div className="flex items-center text-gray-900 font-semibold group-hover:translate-x-1 transition-transform">
                Start AI Mode &rarr;
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionScreen;
