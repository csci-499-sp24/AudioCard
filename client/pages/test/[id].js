import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const TestPage = () => {
  const router = useRouter();
  const { id } = router.query; // This is the ID of the cardset


  return (
    <div>

      <h1>Test Mode for Cardset ID: {id}</h1>
      
    </div>
  );
};

export default TestPage;
