import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../utils/firebase';

function Index() {
  const [userEmail, setUserEmail] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is signed in
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in, set the user's email
        setUserEmail(user.email);
      } else {
        // No user is signed in, redirect to the login page
        router.push('/login');
      }
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Redirect to login page after logout
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div>
      <div>Return message from server</div>
      {userEmail && (
        <div>
          <div>User Email: {userEmail}</div>
          <button onClick={handleLogout}>Logout</button>

         
        </div>
      )}
    </div>
  );
}

export default Index;