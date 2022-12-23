Made with create-react-app https://create-react-app.dev/ under the hood it uses webpack (not Parcel!!!), Babel, ESLint, among other things 

## Install

(Should work on Windows or Linux)

1. Install Node from https://nodejs.org/en/download/
2. `npm install react-scripts`
3. Edit the .env file and paste in your SAS token for the container

## Run in dev mode

Run `npm start` to run app for development purpose, it will auto-refresh when you change the code

## Run in production mode

Run `npm run build` to use production mode (e.g. making sure all the deps still work when bundled), will go into the build dir

You can serve the built files with
```
npm install -g serve
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
serve -s build
```