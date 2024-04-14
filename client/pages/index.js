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
        router.push('/dashboard');
      } else {
        // No user is signed in, redirect to the landing page
        router.push('/welcome');
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

  // Placeholder message while redirecting
  return <div>Loading...</div>;
}

export default Index;
