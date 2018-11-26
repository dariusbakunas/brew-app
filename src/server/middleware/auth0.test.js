import Auth0Strategy from 'passport-auth0';
import { verify } from './auth0';
import getApolloClient from '../apolloClient';

jest.mock('../apolloClient');
jest.mock('passport-auth0');

describe('auth0 Strategy', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    Auth0Strategy.mockClear();
    getApolloClient.mockClear();
  });

  test('verify sets user if email matches existing users', async () => {
    const done = jest.fn();
    const mockClient = {
      query: jest.fn(),
    };

    const testUser = {
      email: 'test@gmail.com',
      firstName: 'Family Name',
      lastName: 'Given Name',
      id: 'TEST_ID',
      username: 'testusername',
    };

    mockClient.query.mockReturnValue(Promise.resolve({ data: { userByEmail: testUser } }));

    getApolloClient.mockReturnValue(mockClient);

    const profile = {
      emails: [{ value: 'test@gmail.com' }],
      name: {
        familyName: 'Family Name',
        givenName: 'Given Name',
      },
      user_id: 'Test User ID',
    };

    await verify('testAccessToken', null, {}, profile, done);

    expect(mockClient.query.mock.calls.length).toBe(1);
    expect(mockClient.query.mock.calls[0][0].variables).toEqual({ email: 'test@gmail.com' });
    expect(done.mock.calls.length).toBe(1);
    expect(done.mock.calls[0][0]).toBeNull();
    expect(done.mock.calls[0][1]).toBe(testUser);
  });
});
