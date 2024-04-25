'use client';

import { auth, firestore } from '@/app/firebase/firebaseConfig'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loading from '@/app/ui/Loading';

type Message = {
    author: string;
    message: string;
    timestamp?: string;
}

export default function ChatPage() {
    const [user, setUser] = useState(auth.currentUser)
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);

            if (!user) {
                router.push('/signup')
            }
            
            return () => unsubscribe()
        })
    })

    const messageSendFunction = async () => {
        const newMessage = document.getElementsByName('message');

        if (newMessage?.length === 0) {
            return;
        }

        const messageValue = newMessage[0] as HTMLInputElement;
        if (messageValue.value.length > 1000) {
            alert('Message too long');
            messageValue.value = '';
            return;
        }

        try {
            const inputElement = newMessage[0] as HTMLInputElement;
            if (inputElement.value === '') {
                return;
            }

            const timestamp = Date.now();
            const timestampString = new Date(timestamp).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });   

            await firestore.collection('messages').add({
                author: user?.displayName,
                message: inputElement.value,
                timestamp: timestampString,
            });

            inputElement.value = '';
        } catch (error) {
            console.error(error);
        }
    }

    const deleteMessageFunction = async (message: Message) => {
        try {
            const messageRef = firestore.collection('messages').where('author', '==', message.author).where('message', '==', message.message).where('timestamp', '==', message.timestamp);
            const messageSnapshot = await messageRef.get();

            if (user?.displayName !== message.author) {
                return;
            }

            messageSnapshot.forEach((doc) => {
                doc.ref.delete();
            });
        } catch (error) {
            console.error(error);
        }
    }

    const editMessageFunction = async (message: Message, inputElement: HTMLInputElement) => {
        try {
            const messageRef = firestore.collection('messages').where('author', '==', message.author).where('message', '==', message.message).where('timestamp', '==', message.timestamp);
            const messageSnapshot = await messageRef.get();

            if (user?.displayName !== message.author) {
                return;
            }

            if (inputElement.value === '') {
                return;
            }

            const messageValue = inputElement as HTMLInputElement;
            if (messageValue.value.length > 1000) {
                alert('Message too long');
                messageValue.value = '';
                return;
            }

            messageSnapshot.forEach((doc) => {
                doc.ref.update({
                    message: inputElement.value
                });

                inputElement.value = '';
                inputElement.classList.toggle('hidden');
            });
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const unsubscribe = firestore.collection('messages').orderBy('timestamp').onSnapshot((snapshot) => {
            const newMessages: Message[] = [];
            snapshot.forEach((doc) => {
                newMessages.push(doc.data() as Message);
            });
            setMessages(newMessages);
        });

        return () => unsubscribe();
    }, []);

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div className='flex flex-row h-screen'>
                    <div className='chat-container'>
                        <div className='messages-container'>
                            {messages.map((message, index) => (
                                <div key={index} className='message'>
                                    <p 
                                        className='pb-3'>
                                        <b>{message.author} | {message.timestamp}</b>
                                        <div className='float-right mr-2'>
                                            <button
                                                onClick={() => {
                                                    if (user?.displayName !== message.author) {
                                                        return;
                                                    }

                                                    const inputElement = document.getElementsByName('edit-message-input')[index] as HTMLInputElement;
                                                    inputElement.classList.toggle('hidden');
                                                    inputElement.value = message.message;
                                                }}
                                            >
                                                <i className="fa-solid fa-pen hover:text-neutral-400 mr-2"></i>
                                            </button>
                                            <button
                                                onClick={() => deleteMessageFunction(message)}
                                            >
                                                <i className="fa-solid fa-trash-alt hover:text-neutral-400"></i>                                         
                                            </button>
                                        </div>                                   
                                    </p>
                                    {message.message.includes('http') ? (
                                        <a href={message.message} target='_blank' className='text-cyan-600 hover:text-cyan-400'>{message.message}</a>
                                    ) : (
                                        <p>{message.message}</p>
                                    )}
                                    
                                    <input  
                                        name='edit-message-input' 
                                        className='h-10 w-[80%] rounded-lg m-2 p-2 text-neutral-50 bg-neutral-500 hidden'
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                editMessageFunction(message, e.target as HTMLInputElement);
                                            }
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className='mb-16'></div>
                        <div className='fixed bottom-0 w-screen'>
                            <div className='bg-neutral-800 flex flex-row'>
                                <input 
                                    placeholder='message...' 
                                    name='message' 
                                    autoComplete='off'
                                    className='h-10 w-[90%] rounded-lg m-2 p-2 text-neutral-50 bg-neutral-500'
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            messageSendFunction();
                                        }
                                    }}
                                />
                            <button
                                className='h-10 w-40 rounded-lg m-2 p-2 text-neutral-50 bg-neutral-500 hover:bg-neutral-700'
                                onClick={() => messageSendFunction()}
                            >
                                <div className='flex flex-row justify-center items-center'>
                                    <span className='hidden md:block lg:block'><i className="fa-solid fa-paper-plane pr-[2px]"></i>Send</span>
                                    <span className='block md:hidden lg:hidden'><i className="fa-solid fa-paper-plane pr-[2px]"></i></span>
                                </div>
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}