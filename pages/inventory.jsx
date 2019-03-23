import React from 'react';
import Main from '../layouts/main';

const Index = ({ currentUser }) => {
  return (
    <Main currentUser={currentUser}>
      <div className={'test'}>
        test
      </div>
    </Main>
  );
};

export default Index;
