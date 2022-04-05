# LOST & FOUND 
### Node.js/Express back-end API
*is an eco-system that leverages technology to build on the foundation of paying it forward!*

 It's also my capstone project for BrainStation's full-stack bootcamp. We were tasked to ideate, plan, and execute a full-stack application within two weeks. Lost&Found was made using create-react-app, react-router, axios, react-burger-menu, react-select, swiper and SASS for the front end, a Node/Express backend API leveraging Passport.js & the passport-google-Oauth2 strategy for authentication, and Knex to migrate, seed and query a MySQL database. At least for now. We'll see how things change as I continue to build on it.

 Below are instructions on how to install the Node/Express API and you can [click here](https://github.com/kirill-develops/lost-and-found-client) to find the front-end React.js app Repo and the remaining steps

 [Click here ](http://linktomyvideo.com)to watch my demo presentation.

 Thanks for stopping by. 💫 

 -Kirill (06-04-2022)

![Screenshot of Lost&Found app](./src/assets/images/big_hug.jpeg)

# Installation
Follow these steps to run a local instance of Lost&Found:
> (You'll need google App credentials and node, npm, and MySQL already installed.)
1. Clone or download this repo.
#### **Set up the back-end**

2. Create a new database in MySQL called `lost-and-found`.

3. Install server dependencies:

    >Run `npm install` from inside the server directory.

        $ cd lost-and-found-server
        $ npm install
4. Set environment variables:
      
      >#### Rename `.env_sample` to `.env` and change placeholder .values with your own.
      >#### You can create google app credentials [here](https://console.developers.google.com/)

        SESSION_SECRET=<YOUR_SESSION_SECRET>
        
        DB_HOST=<YOUR_DATABASE_ADDRESS>
        DB_USER=<YOUR_DATABASE_USERNAME>
        DB_PASSWORD=<YOUR_DATABASE_PASSWORD>
        DB_NAME=<YOUR_DATABASE_FOR_LOST_AND_FOUND> || "lost-and-found"
        DB_TIMEZONE=<YOUR_DATABASE_TIMEZONE>
        PORT=<PORT_NUMER>

        GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
        GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>
        GOOGLE_CALLBACK_URL=<YOUR_GOOGLE_CALLBACK_URL>

        CLIENT_URL=<REACT_CLIENT_PORT>
5. Run migration to create tables
  
        $ npm run migrate
6. Run seed file to generate table data

        $ npm run seed
7. Start the server:

        $ node index.js
#### **Set up the front-end**
8. Goto the [lost-and-found-client](https://github.com/kirill-develops/lost-and-found-client) Repo to complete the setup