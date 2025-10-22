import React, { useState } from 'react';
import { SiteArea, SiteType } from '../types';

interface SiteSelectionViewProps {
    onSiteSelect: (area: SiteArea, type: SiteType) => void;
    onBack: () => void;
}

const SITE_AREAS: SiteArea[] = ['AKC North', 'AKC South'];
const SITE_TYPES: SiteType[] = ['Hospital Unit', 'Urban Satellite', 'Rural Satellite', 'Long Term Care Site'];

const SiteSelectionView: React.FC<SiteSelectionViewProps> = ({ onSiteSelect, onBack }) => {
    const [selectedArea, setSelectedArea] = useState<SiteArea | null>(null);
    const [selectedType, setSelectedType] = useState<SiteType | null>(null);

    const handleContinue = () => {
        if (selectedArea && selectedType) {
            onSiteSelect(selectedArea, selectedType);
        }
    };

    const renderChoiceGroup = (title: string, options: string[], selected: string | null, setter: (value: any) => void) => (
        <div className="w-full">
            <h3 className="text-lg font-semibold text-indigo-300 mb-3">{title}</h3>
            <div className="grid grid-cols-2 gap-3">
                {options.map(option => (
                    <button
                        key={option}
                        onClick={() => setter(option)}
                        className={`p-3 rounded-lg text-base font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                            selected === option
                                ? 'bg-cyan-600 text-white'
                                : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full p-6 text-center">
            <header className="flex justify-between items-center mb-6 flex-shrink-0">
                 <button onClick={onBack} className="py-2 px-4 text-sm bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors">
                    &larr; Change Role
                </button>
                <h2 className="text-2xl font-bold text-cyan-400">Select Your Work Site</h2>
                 <div className="w-28"></div>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center">
                <p className="text-slate-300 mb-8 max-w-2xl">
                    Please select the area and site type this feedback pertains to. This helps us direct your valuable input to the right teams.
                </p>

                <div className="w-full max-w-2xl space-y-8">
                     {renderChoiceGroup('1. Select your area:', SITE_AREAS, selectedArea, setSelectedArea)}
                     {renderChoiceGroup('2. Select your site type:', SITE_TYPES, selectedType, setSelectedType)}
                </div>

                 <button
                    onClick={handleContinue}
                    disabled={!selectedArea || !selectedType}
                    className="w-full max-w-2xl mt-10 py-3 px-6 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default SiteSelectionView;
