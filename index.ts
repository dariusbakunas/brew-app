if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import routing from './routing';
import server from './server';

server(routing);
