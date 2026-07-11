export const APP_NAME='EMA EMITS College Portal';export const APP_VERSION='1.0.0';export const API_BASE_URL=process.env.REACT_APP_API_URL||'http://localhost:8000/api';

// Self-service registration only offers these 3 classifications.
// Admin is never selectable directly - see POSITION_OPTIONS below.
export const ROLE_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'faculty', label: 'Teacher' },
  { value: 'organization', label: 'Organization (EEMG)' },
];

// Positions available once Teacher or Organization is picked.
// Selecting an admin-eligible position auto-grants Admin access.
export const POSITION_OPTIONS = {
  faculty: [
    { value: 'regular', label: 'Regular Teacher' },
    { value: 'department_head', label: 'Department Head (needs Admin approval)' },
    { value: 'principal', label: 'Principal (needs Admin approval)' },
  ],
  organization: [
    { value: 'regular', label: 'Member' },
    { value: 'president', label: 'President - EEMG (needs Admin approval)' },
  ],
};

export const ADMIN_ELIGIBLE_POSITIONS = ['department_head', 'principal', 'president'];