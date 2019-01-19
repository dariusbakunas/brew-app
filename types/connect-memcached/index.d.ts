declare module 'connect-memcached' {
  import { MemoryStore } from 'express-session';

  export class Store extends MemoryStore {
    constructor(options?: {
      hosts?: string[],
      prefix?: string,
      secret?: string,
    });
  }

  export default function memcached(session: {}): typeof Store;
}
