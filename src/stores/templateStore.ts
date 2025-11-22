
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { NodeTemplate } from '../types/template.types';
import { BUILT_IN_TEMPLATES } from '../constants/templates';
import { BaseNode } from '../types/node.types';

interface TemplateState {
  customTemplates: NodeTemplate[];
  
  // Actions
  addCustomTemplate: (node: BaseNode, name: string, description?: string) => void;
  deleteCustomTemplate: (id: string) => void;
  getAllTemplates: () => NodeTemplate[];
}

export const useTemplateStore = create<TemplateState>()(
  persist(
    (set, get) => ({
      customTemplates: [],

      addCustomTemplate: (node, name, description = 'Custom saved template') => {
        const newTemplate: NodeTemplate = {
          id: `tpl-custom-${Date.now()}`,
          name,
          description,
          category: 'custom',
          icon: 'Star',
          isCustom: true,
          data: {
            type: node.type,
            title: node.title,
            description: node.description,
            visual: node.visual,
            tags: node.tags,
            // Clone specific data fields based on type
            task: node.task,
            person: node.person,
            video: node.video,
            workflow: node.workflow ? { ...node.workflow, start: undefined, end: undefined } : undefined, // Don't copy specific dates
          }
        };
        set(state => ({ customTemplates: [...state.customTemplates, newTemplate] }));
      },

      deleteCustomTemplate: (id) => {
        set(state => ({ customTemplates: state.customTemplates.filter(t => t.id !== id) }));
      },

      getAllTemplates: () => {
        return [...BUILT_IN_TEMPLATES, ...get().customTemplates];
      }
    }),
    {
      name: 'jirai-templates-v1',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
