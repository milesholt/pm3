// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  firebase: {
     apiKey: "AIzaSyBAhZc4AJgvSwMyEyQH04q3DRa8tuJK9mU",
     authDomain: "project-manager-2045e.firebaseapp.com",
     databaseURL: "https://project-manager-2045e.firebaseio.com",
     projectId: "project-manager-2045e",
     storageBucket: "project-manager-2045e.appspot.com",
     messagingSenderId: "1026315619936"
   },
   googleWebClientId:"7138109007-32hoimd70gnu8i88u37h2iloeb70l688.apps.googleusercontent.com"
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
