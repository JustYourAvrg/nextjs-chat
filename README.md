# NEXTJS CHAT APP EXAMPLE
This is a simple chat app that uses Next.JS, Firebase, and TailwindCSS.
for a live demo, [click here](https://chatting-app-test-chi.vercel.app/)

## Getting Started
1. Clone the repository
2. Run `npm install`
3. Create a new Firebase project
4. Create a `.env.local` file in the root of the project and add the following:
```
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
```
5. Make sure to enable enable email/password authentication in Firebase
6. Add the font 'Kalam' from Google Fonts to your project
8. Add 'Font Awesome' to your project
9. Run `npm run dev` to start the development server then go to [localhost](http://localhost:3000) in your browser

## Built With
- [Next.JS](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Font Awesome](https://fontawesome.com/)
- [Google Fonts](https://fonts.google.com/)

## Features
- Authentication
- Real-time chat
- Edit/Delete messages

## Inspiration
This project was inspired by [this tutorial](https://www.youtube.com/watch?v=zQyrwxMPm88) by Fireship.