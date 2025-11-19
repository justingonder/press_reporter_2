import { Journal, Stage } from '../types';

const subDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const mockJournals: Journal[] = [
  {
    id: 1,
    code: 'JOSS',
    name: 'Journal of Open Source Studies',
    articles: [
      {
        id: 101,
        title: 'A Study on React Performance',
        date_submitted: subDays(45),
        stage: Stage.UNASSIGNED,
        editor_assignments: [],
        reviews: [],
      },
      {
        id: 102,
        title: 'Tailwind CSS in 2025',
        date_submitted: subDays(10),
        stage: Stage.UNDER_REVIEW,
        editor_assignments: [{ id: 1, editor_name: 'Alice Smith', editor_type: 'editor', date_assigned: subDays(9) }],
        reviews: [
          {
            id: 501,
            reviewer_name: 'Bob Jones',
            date_assigned: subDays(8),
            is_complete: true,
            date_complete: subDays(7), // Completed 7 days ago, editor hasn't moved it
            decision: 'Accept',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    code: 'DHQ',
    name: 'Digital Humanities Quarterly',
    articles: [
      {
        id: 201,
        title: 'Scanning Ancient Manuscripts',
        date_submitted: subDays(2),
        stage: Stage.UNASSIGNED,
        editor_assignments: [],
        reviews: [],
      },
    ],
  },
  {
    id: 3,
    code: 'OLH',
    name: 'Open Library of Humanities',
    articles: [
      {
        id: 301,
        title: 'The Future of Academic Publishing',
        date_submitted: subDays(60),
        stage: Stage.UNASSIGNED,
        editor_assignments: [],
        reviews: [],
      },
      {
        id: 302,
        title: 'Plugin Architecture in Django',
        date_submitted: subDays(20),
        stage: Stage.UNDER_REVIEW,
        editor_assignments: [{ id: 2, editor_name: 'Charlie Day', editor_type: 'section-editor', date_assigned: subDays(19) }],
        reviews: [
            {
                id: 505,
                reviewer_name: 'Dana White',
                date_assigned: subDays(15),
                is_complete: true,
                date_complete: subDays(14), // Completed 14 days ago, stalled
                decision: 'Minor Revisions',
            }
        ]
      },
       {
        id: 303,
        title: 'Database Optimization',
        date_submitted: subDays(5),
        stage: Stage.UNDER_REVIEW,
        editor_assignments: [{ id: 3, editor_name: 'Frank Reynolds', editor_type: 'editor', date_assigned: subDays(4) }],
        reviews: [
            {
                id: 506,
                reviewer_name: 'Dennis',
                date_assigned: subDays(3),
                is_complete: false,
            }
        ]
      },
    ],
  },
];
