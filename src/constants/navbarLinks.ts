export const NAVBAR_LINKS = [
  {
    name: 'Login',
    path: '/auth',
    active: true,
  },
  {
    name: 'Home',
    path: '/',
    active: true,
    requiresAuth: true,
  },
  {
    name: 'Applied Jobs',
    path: '/profile/applied-jobs',
    active: true,
    requiresAuth: true,
  },
  {
    name: " Today's Jobs",
    path: '/jobs/todays-jobs',
    active: true,
    requiresAuth: true,
  },
];
