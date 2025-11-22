
import { NodeTemplate } from '../types/template.types';
import { COLORS } from '../constants';

export const BUILT_IN_TEMPLATES: NodeTemplate[] = [
  {
    id: 'tpl-quick-task',
    name: 'Quick Task',
    description: 'A simple task with a priority flag.',
    category: 'productivity',
    icon: 'CheckSquare',
    data: {
      type: 'task',
      title: 'New Task',
      status: 'todo',
      visual: { color: COLORS.SUCCESS, shape: 'rounded-rect' },
      task: { priority: 'medium', estimatedMinutes: 30 }
    }
  },
  {
    id: 'tpl-meeting-notes',
    name: 'Meeting Notes',
    description: 'Structure for agenda, attendees, and action items.',
    category: 'productivity',
    icon: 'StickyNote',
    data: {
      type: 'note',
      title: 'Meeting: [Topic]',
      description: "## Attendees\n- \n\n## Agenda\n1. \n2. \n\n## Action Items\n- [ ] ",
      visual: { color: COLORS.WARNING, shape: 'rounded-rect' }
    }
  },
  {
    id: 'tpl-project-plan',
    name: 'Project Plan',
    description: 'High-level project card with milestones.',
    category: 'planning',
    icon: 'Box',
    data: {
      type: 'project',
      title: 'Project Alpha',
      description: "Goal: \n\nMilestones:\n- Phase 1: \n- Phase 2: ",
      visual: { color: COLORS.INFO, shape: 'rounded-rect' },
      tags: ['planning', 'q1']
    }
  },
  {
    id: 'tpl-research',
    name: 'Research Topic',
    description: 'Topic node with resources placeholder.',
    category: 'research',
    icon: 'Brain',
    data: {
      type: 'topic',
      title: 'Research: [Subject]',
      description: "Key Questions:\n1. \n2. \n\nSources:\n- ",
      visual: { color: COLORS.PURPLE, shape: 'rounded-rect' }
    }
  },
  {
    id: 'tpl-person',
    name: 'Person Profile',
    description: 'Contact card with role and details.',
    category: 'personal',
    icon: 'User',
    data: {
      type: 'person',
      title: 'New Contact',
      person: { role: 'Role', email: '', phone: '' },
      visual: { color: COLORS.PURPLE, shape: 'circle' }
    }
  },
  {
    id: 'tpl-video-notes',
    name: 'Video Analysis',
    description: 'Video placeholder with timestamp notes structure.',
    category: 'research',
    icon: 'Youtube',
    data: {
      type: 'video',
      title: 'Video Title',
      description: "## Key Points\n00:00 - Intro\n05:30 - Main Idea\n\n## Takeaways\n- ",
      visual: { color: COLORS.RED, shape: 'rounded-rect' },
      video: { platform: 'youtube', videoId: '', url: '' }
    }
  },
  {
    id: 'tpl-weekly-review',
    name: 'Weekly Review',
    description: 'Reflection template for wins and challenges.',
    category: 'personal',
    icon: 'FileText',
    data: {
      type: 'document',
      title: 'Weekly Review',
      description: "## Wins 🏆\n- \n\n## Challenges 🚧\n- \n\n## Next Week Goals 🎯\n- ",
      visual: { color: '#6366f1', shape: 'rounded-rect' }
    }
  }
];
