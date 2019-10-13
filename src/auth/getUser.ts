import { Request } from 'express';
import fetch from 'isomorphic-fetch';

interface IPassportUser {
  profile: {
    emails: Array<{ value: string }>;
  };
}

export interface IUser {
  email: string;
}

const getUser: (req: Request) => Promise<IUser> = async req => {
  if (typeof window === 'undefined') {
    if (req && req.session && req.session.passport && req.session.passport.user) {
      const user: IPassportUser = req.session.passport.user;

      return {
        email: user.profile.emails[0].value,
      };
    }

    return null;
  } else {
    const baseURL = req ? `${req.protocol}://${req.get('Host')}` : '';
    const res = await fetch(`${baseURL}/auth/user`);
    return await res.json();
  }
};

export default getUser;
