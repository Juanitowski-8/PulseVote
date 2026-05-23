import type { Poll } from '@/types/poll'

const now = new Date().toISOString()

export const INITIAL_POLLS: Poll[] = [
  {
    id: 'poll_1',
    question: '¿Qué stack prefieres para un MVP en 24 horas?',
    isActive: true,
    createdById: 'usr_admin',
    totalVotes: 47,
    createdAt: now,
    updatedAt: now,
    options: [
      { id: 'opt_1_1', text: 'Node + React + PostgreSQL', pollId: 'poll_1', voteCount: 22 },
      { id: 'opt_1_2', text: 'Django + Vue + MySQL', pollId: 'poll_1', voteCount: 9 },
      { id: 'opt_1_3', text: 'Laravel + Inertia', pollId: 'poll_1', voteCount: 8 },
      { id: 'opt_1_4', text: 'Firebase + Next.js', pollId: 'poll_1', voteCount: 8 },
    ],
  },
  {
    id: 'poll_2',
    question: '¿Cuál es tu prioridad al diseñar una API REST?',
    isActive: true,
    createdById: 'usr_admin',
    totalVotes: 31,
    createdAt: now,
    updatedAt: now,
    options: [
      { id: 'opt_2_1', text: 'Consistencia y validaciones', pollId: 'poll_2', voteCount: 14 },
      { id: 'opt_2_2', text: 'Documentación OpenAPI', pollId: 'poll_2', voteCount: 10 },
      { id: 'opt_2_3', text: 'Performance extrema', pollId: 'poll_2', voteCount: 7 },
    ],
  },
  {
    id: 'poll_3',
    question: '¿Cómo prefieres actualizar resultados en tiempo real?',
    isActive: true,
    createdById: 'usr_admin',
    totalVotes: 18,
    createdAt: now,
    updatedAt: now,
    options: [
      { id: 'opt_3_1', text: 'Polling cada 3s', pollId: 'poll_3', voteCount: 11 },
      { id: 'opt_3_2', text: 'WebSockets', pollId: 'poll_3', voteCount: 5 },
      { id: 'opt_3_3', text: 'Server-Sent Events', pollId: 'poll_3', voteCount: 2 },
    ],
  },
  {
    id: 'poll_4',
    question: 'Encuesta archivada: ¿Trabajas remoto o híbrido?',
    isActive: false,
    createdById: 'usr_admin',
    totalVotes: 64,
    createdAt: now,
    updatedAt: now,
    options: [
      { id: 'opt_4_1', text: '100% remoto', pollId: 'poll_4', voteCount: 38 },
      { id: 'opt_4_2', text: 'Híbrido', pollId: 'poll_4', voteCount: 20 },
      { id: 'opt_4_3', text: 'Presencial', pollId: 'poll_4', voteCount: 6 },
    ],
  },
]
