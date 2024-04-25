'use client';

import { auth } from '@/app/firebase/firebaseConfig'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from './ui/Loading';

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(auth.currentUser)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);

      if (!user) {
        router.push('/signup')
      }

      return () => unsubscribe()
    })
  }, [])

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        router.push('/dashboard')
      )}
    </>
  );
}
