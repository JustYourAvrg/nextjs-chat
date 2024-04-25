'use client';

import { auth, firestore, browserPersistence } from '@/app/firebase/firebaseConfig'
import { useRouter } from "next/navigation";
import { useState } from "react";
import formChecks from '@/app/lib/actions';
import Link from 'next/link'

export default function CreateUserForm() {
    const [error, setError] = useState("");
    const router = useRouter();

    const attemptRegister = async (e: any) => {
        e.preventDefault();

        const email = e.target.email.value;
        const username = e.target.username.value;
        const password = e.target.password.value;

        const checks = formChecks(email, "NONE", password);
        if (checks !== true) {
            setError(checks);
            return;
        }
        
        try {
            await auth.setPersistence(browserPersistence);
            
            const user = await firestore.collection('users').doc(username).get();
            if (user.exists) {
                setError("Username already taken");
                return;
            } else {
                await firestore.collection('users').doc(username).set({
                    email: email,
                    username: username,
                });
            }

            await auth.createUserWithEmailAndPassword(email, password);
            await auth.currentUser?.updateProfile({
                displayName: username
            });

            router.push('/');
        } catch (error: any) {
            switch (error.code) {
                case "auth/invalid-credential":
                    setError("Invalid credentials");
                    break;
                case "auth/invalid-email":
                    setError("Invalid email");
                    break;
                case "auth/email-already-exists":
                    setError("Email already exists");
                    break;
            }
        }
    }

    return (
        <div className="flex flex-row justify-center items-center h-screen">
            <div className="bg-neutral-800 rounded-md border-neutral-500 border-2 w-96 h-fit lg:w-96 md:w-96 md:h-fit lg:h-fit">
                <div className="text-center p-2 mb-6 border-b-2 border-white">
                    <h1 className="text-4xl font-Kalam">Register</h1>
                </div>
                <div className="text-center text-red-500">
                    {error}
                </div>
                <form onSubmit={attemptRegister}>
                    <div className="flex flex-col items-center justify-center formInput">
                        <input placeholder="email" type="text" name="email" required/>
                        <input placeholder="username" type="text" name="username" required/>
                        <input placeholder="password" type="password" name="password" required/>
                    </div>
                    <div className="flex flex-row justify-center items-center mt-4 mb-2">
                        <button className="bg-neutral-900 w-[80%] h-12 rounded-md border-2 border-neutral-400 hover:bg-neutral-700">
                            Register
                        </button>
                    </div>
                    <div className="flex justify-start p-2 text-xs hover:text-neutral-500">
                        <Link href="/auth">
                            Already have an account? Sign In!
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );  
}