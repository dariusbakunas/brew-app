import getApolloClient from '../apolloClient';
import { verify } from './auth0';

jest.mock('../apolloClient');
jest.mock('passport-auth0');

describe('auth0 Strategy', () => {
  test('verify sets user if email matches existing user', async () => {
    const done = jest.fn();
    const mockClient = {
      query: jest.fn(),
    };

    const testUser = {
      email: 'test@gmail.com',
      firstName: 'Family Name',
      id: 'TEST_ID',
      lastName: 'Given Name',
      username: 'testusername',
    };

    mockClient.query.mockReturnValue(Promise.resolve({ data: { userByEmail: testUser } }));
    (getApolloClient as jest.Mock).mockReturnValue(mockClient);

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
