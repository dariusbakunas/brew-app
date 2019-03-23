const routes = {
  '/': { page: 'index', requireAuth: true },
  '/inventory': { page: 'inventory', requireAuth: true },
  '/users': { page: 'users', requireAuth: true },
  '/login': { page: 'login', requireAuth: false },
  '/privacy': { page: 'privacy', requireAuth: false },
  '/terms': { page: 'terms', requireAuth: false },
}

module.exports = () => routes;
