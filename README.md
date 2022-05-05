# Pals Only

## About

A message board application where users authenticate themselves via Passport.js. Authenticated users can post new messages. Users become members by entering a secret passcode in the [Member form](https://pals-only.herokuapp.com/users/member). Members can see the author of the message and view their profiles. If they wish, users can become admins by entering a secret passcode in the [Admin form](https://pals-only.herokuapp.com/users/admin). Admins can delete any message.

## Technologies

  - Written in a NodeJS Framwork: [Express](https://expressjs.com/)
  - Employes a Model, View, Controller architecture 
  - Authenticates users with [Passport.js](https://www.passportjs.org/)
  - Uses [Pug](https://pugjs.org/api/getting-started.html) as the templating engine
  - Styled via [Tailwind CSS](https://tailwindcss.com/)

## Setting up Locally

1. Clone this repository:
```bash
git clone git@github.com:01zulfi/pals-only.git
```
2. Install dependences: 
```bash
npm install
```
3. Create a database on [MongoDB](https://www.mongodb.com/).
4. Create a `.env` file with the following:
```
MONGODB_URL="your mongodb connection url here"
SESSION="any random long string here"
```
5. Start the server:
```bash
npm run serverstart
```
   

## Attributions

  - Favicon from [svgrepo.com](https://www.svgrepo.com/)
  - Color palette from [dracula](https://draculatheme.com/contribute)

----

![image](https://user-images.githubusercontent.com/85733202/166969522-ca92a849-639a-4b68-8069-0e7f317e0a97.png)
![image](https://user-images.githubusercontent.com/85733202/166969600-7327a25d-2cb2-42ab-8b7d-f7f333737226.png)
