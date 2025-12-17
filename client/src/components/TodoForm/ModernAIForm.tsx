import React, { useState } from 'react';
import { useTodo } from '../../context/TodoContext';
import { X, Sparkles, Brain, Clock, ChevronRight } from 'lucide-react';

interface ModernFormProps {
  onClose: () => void;
}

const ModernAIForm: React.FC<ModernFormProps> = ({ onClose }) => {
  const { createTodo } = useTodo();
  const totalSteps = 4;
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    durationValue: 30,
    durationUnit: 'days',
    reminderEnabled: true,
    motivationalEnabled: true,
  });

  const [generating] = useState(false);
  
  /* AI Roadmap Generator (Heuristic for now) */
  const generateRoadmap = () => {
      const units = formData.durationUnit;
      const val = Number(formData.durationValue);
      const generatedMilestones = [];
      
      const count = units === 'days' ? Math.ceil(val / 7) : val; // Weekly if days, Monthly if months
      const unitLabel = units === 'days' ? 'Week' : 'Month';
      
      const phases = [
          "Foundation & Research",
          "Core Implementation",
          "Advanced Concepts",
          "Practice & Refinement",
          "Final Project & Mastery"
      ];

      for(let i=0; i<count; i++) {
          // Cycle phases if long duration
          const title = i < phases.length ? phases[i] : `Continued Progress (Phase ${i+1})`;
          
          generatedMilestones.push({
              title: `${unitLabel} ${i+1}: ${title}`,
              completed: false
          });
      }
      return generatedMilestones;
  };

  const [milestones, setMilestones] = useState<{title: string, completed: boolean}[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = async () => {
    if (step === 2) {
        // Generate roadmap when moving from Step 2
        const road = generateRoadmap();
        setMilestones(road);
    }
    setStep(prev => prev + 1);
  };
  
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    // Calculate dates
    const start = new Date();
    const target = new Date();
    if (formData.durationUnit === 'days') {
       target.setDate(start.getDate() + Number(formData.durationValue));
    } else {
       target.setMonth(start.getMonth() + Number(formData.durationValue));
    }

    await createTodo({
      type: 'modern',
      title: formData.title,
      description: formData.description,
      duration: {
          value: Number(formData.durationValue), 
          unit: formData.durationUnit as 'days' | 'months'
      },
      startDate: start,
      targetDate: target,
      reminderEnabled: formData.reminderEnabled,
      motivationalEnabled: formData.motivationalEnabled,
      priority: 'high',
      milestones: milestones // Save AI milestones
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-700 to-black p-6 text-white text-center relative">
          <button onClick={onClose} className="absolute right-4 top-4 text-white/70 hover:text-white transition-opacity">
            <X className="h-6 w-6" />
          </button>
          <Sparkles className="h-10 w-10 mx-auto mb-2 text-gray-300 animate-pulse" />
          <h3 className="text-2xl font-bold">New AI-Tracked Goal</h3>
          <div className="w-full max-w-xs mx-auto mt-6">
            <div className="flex justify-between text-xs text-white/70 mb-2 font-medium">
                <span>Step {step}</span>
                <span>of {totalSteps}</span>
            </div>
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-white transition-all duration-500 ease-out" 
                    style={{ width: `${(step / totalSteps) * 100}%` }} 
                />
            </div>
          </div>
        </div>

        <div className="p-8">
           {/* Step 1: Definition */}
           {step === 1 && (
             <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-6">
                   <Brain className="h-12 w-12 text-gray-700 mx-auto mb-3 bg-gray-100 p-2 rounded-xl" />
                   <h4 className="text-lg font-semibold text-gray-800">What do you want to achieve?</h4>
                   <p className="text-sm text-gray-500">Define your objective clearly for the AI assistant.</p>
                </div>
                
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title</label>
                   <input
                     name="title"
                     value={formData.title}
                     onChange={handleChange}
                     className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none text-lg"
                     placeholder="e.g., Learn Spanish, Run a Marathon"
                   />
                </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Why is this important?</label>
                   <textarea
                     name="description"
                     value={formData.description}
                     onChange={handleChange}
                     className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                     rows={3}
                     placeholder="The AI will use this to keep you motivated..."
                   />
                </div>
             </div>
           )}

           {/* Step 2: Timeline */}
           {step === 2 && (
             <div className="space-y-6 animate-fade-in">
                 <div className="text-center mb-6">
                   <Clock className="h-12 w-12 text-gray-600 mx-auto mb-3 bg-gray-100 p-2 rounded-xl" />
                   <h4 className="text-lg font-semibold text-gray-800">Set your timeline</h4>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <div className="flex space-x-4">
                       <input
                         type="number"
                         name="durationValue"
                         value={formData.durationValue}
                         onChange={handleChange}
                         className="w-24 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 outline-none text-center font-bold text-lg"
                       />
                       <select
                         name="durationUnit"
                         value={formData.durationUnit}
                         onChange={handleChange}
                         className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 outline-none bg-white"
                       >
                         <option value="days">Days</option>
                         <option value="months">Months</option>
                       </select>
                    </div>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700 flex items-start">
                   <span className="mr-2">💡</span>
                   <p>Click Next to continue to setup.</p>
                </div>
             </div>
           )}

            {/* Step 3: AI Roadmap Review (NEW) */}
            {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="text-center mb-4">
                        <Sparkles className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        <h4 className="text-lg font-semibold text-gray-800">AI Generated Roadmap</h4>
                        <p className="text-sm text-gray-500">Here is your plan to success.</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 max-h-60 overflow-y-auto border border-gray-200">
                        <ul className="space-y-3">
                            {milestones.map((m, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                    <div className="bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">{i+1}</div>
                                    <span className="text-gray-700 font-medium">{m.title}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <p className="text-xs text-center text-gray-400">You can adjust these later.</p>
                </div>
            )}

            {/* Step 4: Tracking (Was Step 3) */}
            {step === 4 && (
               <div className="space-y-6 animate-fade-in">
                  <div className="text-center mb-6">
                    <h4 className="text-lg font-semibold text-gray-800">Tracking Setup</h4>
                    <p className="text-sm text-gray-500">Configure how you want to track this goal.</p>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-xl hover:border-gray-400 cursor-pointer transition-colors" onClick={() => setFormData(p => ({...p, reminderEnabled: !p.reminderEnabled}))}>
                       <div>
                          <p className="font-medium text-gray-900">Daily Accountability</p>
                          <p className="text-xs text-gray-500">Receive daily check-in prompts</p>
                       </div>
                       <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.reminderEnabled ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <div className={`h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform ${formData.reminderEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                       </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-xl hover:border-gray-400 cursor-pointer transition-colors" onClick={() => setFormData(p => ({...p, motivationalEnabled: !p.motivationalEnabled}))}>
                       <div>
                          <p className="font-medium text-gray-900">Progress Tracking</p>
                          <p className="text-xs text-gray-500">Enable visual progress bars</p>
                       </div>
                       <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.motivationalEnabled ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <div className={`h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform ${formData.motivationalEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                       </div>
                    </div>
                 </div>
               </div>
            )}

           {/* Footer Buttons */}
           <div className="flex justify-between mt-8 pt-6 border-t font-medium">
              <button
                onClick={step === 1 ? onClose : handleBack}
                className="px-6 py-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                disabled={generating}
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </button>
              
              {step < totalSteps ? (
                 <button
                   onClick={handleNext}
                   className="flex items-center px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                   disabled={false}
                 >
                   {step === 2 ? 'Review Plan' : 'Next'} { <ChevronRight className="ml-2 h-4 w-4" />}
                 </button>
              ) : (
                 <button
                   onClick={handleSubmit}
                   className="flex items-center px-8 py-2 bg-gradient-to-r from-gray-700 to-black text-white rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                 >
                   Start Journey <Sparkles className="ml-2 h-4 w-4" />
                 </button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
export default ModernAIForm;

