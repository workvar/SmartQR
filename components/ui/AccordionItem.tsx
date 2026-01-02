
import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface AccordionItemProps {
    value: string;
    label: string;
    icon: React.ElementType;
    children: React.ReactNode;
    isDark?: boolean;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ value, label, icon: Icon, children, isDark = false }) => (
    <Accordion.Item value={value} className="overflow-hidden transition-all">
        <Accordion.Header className="flex">
            <Accordion.Trigger className={`group flex h-16 flex-1 cursor-pointer items-center justify-between px-6 text-left transition-all ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}>
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDark ? 'bg-white/10 text-white/70' : 'bg-black/10 text-black/70'} group-data-[state=open]:bg-blue-600 group-data-[state=open]:text-white`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-sm font-bold tracking-tight uppercase tracking-widest ${isDark ? 'text-white/90' : 'text-black/90'}`}>{label}</span>
                </div>
                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.87,0,0.13,1)] group-data-[state=open]:rotate-180 ${isDark ? 'text-white/60' : 'text-black/60'}`} />
            </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="AccordionContent">
            <div className={`px-6 pb-6 md:px-10 md:pb-10 pt-0 space-y-10 animate-in fade-in duration-500 border-t ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                {children}
            </div>
        </Accordion.Content>
    </Accordion.Item>
);
