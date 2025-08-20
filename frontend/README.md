<h1 align="center">Frontend: ANIPROJECT</h1>

1. Inside the folder, you should run `npm install` on your CMD to get all dependencies 

```javascript
npm install
```

2. Now you will need to create a `.env.local` file or fill the `.env.example` and replace its name on the `project root folder`, and follow the instructions bellow.

   - **Anilist Login** (OAuth):
     - You need to first login on your account on Anilist.
     - Then go to <a href='https://anilist.co/settings/developer'>Developer Page</a> on the Settings and click "Create New Client".
     - Now you need to add the name of your forked project/website and the URL to redirect when user accept the login, then hit "Save".
     - Store the Client ID and Secret on your ".env.local".
     - TIP: Create 2 of these, one for the dev env and other to production.
   - **Firebase** (to use Google, Email and Anonymous Login and the Firestore Database):

     - Create a project for this fork/clone you did on <a href='https://console.firebase.google.com/' target="_blank" rel="noreferrer">Firebase</a>.
     - All the Firebase info needed on `.env.local` **can be found when you create a new project**.
     - **IMPORTANT**: Make Sure to ALLOW your Hosted Website Domain on Firebase Authentication!
     - **IMPORTANT**: You'll need to **change the Rules** on **Firestore Database**. There is 2 options depending of what login methods you will use:

       - With **ALL** Login Methods available:

         ```javascript
            rules_version = '2';

            service cloud.firestore {
              match /databases/{database}/documents {

                match /{document=**} {
                  // will allow any write and read operation. No conditions due to Anilist OAuth Login.
                  allow read, write: if true;
                }

              }
            }
         ```

       - With **ONLY** Firebase Login Methods (no Anilist Login):

         ```javascript
           rules_version = '2';

           service cloud.firestore {
             match /databases/{database}/documents {

               match /users/{document=**} {
                 // allows only requests if a userUID is available.
                 allow read, write: request.auth.uid != null;
               }

               match /comments/{document=**} {
                 // allows only write request if a userUID is available.
                 allow read: if true;
                 allow write: request.auth.uid != null;
               }

               match /notifications/{document=**} {
                 // allows only write request if a userUID is available.
                 allow read: if true;
                 allow write: request.auth.uid != null;
               }

             }
           }
         ```

With all that done, you can follow the pre-made `.env.example` on the root folder or fill the `.env.local` like the example bellow:

```javascript
// Anilist OAuth Settings
NEXT_PUBLIC_ANILIST_CLIENT_ID=your-anilist-client-id
ANILIST_CLIENT_SECRET=your-anilist-secret

// Bellow is the url to use ONLY on Dev Enviroment. You WILL NEED TO CHANGE IT when on hosted mode to the respective url. Look for something like Enviroment Variables to do it.
NEXT_PUBLIC_WEBSITE_ORIGIN_URL=http://localhost:3000

// Firebase Settings
NEXT_PUBLIC_FIREBASE_API_KEY=firebase-setting-related-to-this-field
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=firebase-setting-related-to-this-field
NEXT_PUBLIC_FIREBASE_PROJECT_ID=firebase-setting-related-to-this-field
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=firebase-setting-related-to-this-field
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER=firebase-setting-related-to-this-field
NEXT_PUBLIC_FIREBASE_APP_ID=firebase-setting-related-to-this-field
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=firebase-setting-related-to-this-field
NEXT_PUBLIC_FIREBASE_DATABASE_URL=firebase-setting-related-to-this-field

// GOOGLE ANALYTICS: optional
NEXT_PUBLIC_MEASUREMENT_ID=your-measurement-id
```

3. With all this done, it should be good to go! 

Do the ``backend README`` and run the ``frontend`` with the code bellow!


```javascript
npm run dev
```