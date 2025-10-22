import React from 'react';
import { UserRole } from '../types';

interface RoleSelectionViewProps {
    onRoleSelect: (role: UserRole) => void;
}

const ROLES: UserRole[] = ["Physician / NP", "Nursing Staff", "Allied Health and Pharmacy Staff"];

const RoleSelectionView: React.FC<RoleSelectionViewProps> = ({ onRoleSelect }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center relative">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-cyan-400 mb-2">Feedback on Hemodialysis Workflows</h1>
                <h2 className="text-xl text-indigo-300">An Opportunity to Make Changes</h2>
            </header>
            
            <p className="text-slate-300 mb-6 max-w-3xl">
                The EPIC tech team wants to know about hemodialysis workflow pain points and areas for improvement. 
                Please provide honest, constructive feedback to help us improve the program. 
                All responses are <span className="font-bold text-yellow-300">ANONYMOUS</span>.
            </p>

            <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg mb-8 max-w-3xl text-sm">
                <p className="font-bold mb-1">IMPORTANT: Please Read Before Starting</p>
                <ul className="list-disc list-inside text-left">
                    <li>This survey is <span className="font-semibold">completely anonymous</span>. No identifying data is collected or stored.</li>
                    <li><span className="font-semibold text-red-400">DO NOT</span> mention any patient names, medical record numbers, or other Personal Health Information (PHI).</li>
                </ul>
            </div>
            
            <div className="w-full max-w-xl">
                 <h3 className="text-xl font-semibold text-indigo-300 mb-4">First, please select your role:</h3>
                 <div className="flex flex-col space-y-3">
                    {ROLES.map(role => (
                        <button
                            key={role}
                            onClick={() => onRoleSelect(role)}
                            className="w-full p-4 bg-slate-700 rounded-lg text-lg font-semibold hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            {role}
                        </button>
                    ))}
                 </div>
            </div>
        </div>
    );
};

export default RoleSelectionView;
