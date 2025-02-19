# Google Drive Clone Project
This project is about creating a basic clone of Google's Drive service. There are quite a few external services used to simplify certain functionalities of the application such as file storage, cloud upload, authentication and web analytics. In a way, using all of these tools reflects how to build a production ready real-life web application.

[Click here to see final version of the project!](https://drive-tutorial-furkankovan.netlify.app/)

All of the used services do provide a free tier to try out their products. To run this project locally please make sure to sign up to the relevant services. Also please check out the environment variables example ('.env.example' file) for configuration values. 

Special thanks to [t3.gg](https://www.youtube.com/@t3dotgg) for providing the tutorial videos.

## Stack:
- [React](https://react.dev/)
- [Next.js](http://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Drizzle](https://orm.drizzle.team/) (database)

## External Services Used in Project:
- [T3 Stack](https://create.t3.gg/) - bootstrap for full-stack nextjs app projects
- [V0](https://v0.dev/) - generative chat for building UI components, mainly uses [shadcn](https://ui.shadcn.com/)
- [Netlify](https://www.netlify.com/) - development and management platform for web apps
- [Singlestore](https://www.singlestore.com/) - database management system
- [Clerk](https://clerk.com/) - authentication management
- [UploadThing](https://uploadthing.com/) - easier file upload handler
- [PostHog](https://posthog.com/) - product analytics
- [GitHub](https://github.com/) - code share and storage, version control and CI/CD pipeline

## TODO
- [x] Make a TODO list
- [x] Create a mockup UI
- [x] Set up database and data model
- [x] Move folder open state to URL
- [x] Add auth
- [x] Add file uploading
- [x] Add analytics
- [x] Add delete files
- [x] Real homepage and onboarding
- [x] Add create, rename, delete folder
- [ ] Add rename files
- [ ] Populate type field properly for files
- [x] Prettify UI a bit
- [x] Add disclaimer

## Steps taken:
1. Create the project using [T3 stack](https://create.t3.gg/) (pnpm create t3-app@latest project-name)
2. Initialize [git](https://git-scm.com/) and create a [GitHub](https://github.com/) repo
3. Synch GitHub repo with [Netlify](https://app.netlify.com/)
4. Build a starting mockup UI with [V0](https://v0.dev/)
5. Add github CI yaml file (.github/workflows/ci.yaml) to typecheck and lint on push commands
6. Handle database configuration for [Singlestore](https://www.singlestore.com/) under server/db/index.ts, configure [drizzle](https://orm.drizzle.team/) config, add dummy schema to test connection
7. Rework files under app to better fit tutorial files to prevent unrelated issues
8. Create a sandbox environment to send mock data to [Singlestore](https://www.singlestore.com/) database and make app get actual data from database instead of mock data
9. Add folder route to go to a folder by using folder id on url
10. Seperate data access layer to another component (from page to queries) for cleanup
11. Implement Google account auth with [Clerk](https://clerk.com/)
12. Add file upload button and proper functionality with [UploadThing](https://uploadthing.com/), updates on db
13. Add ownership to files and uploads, make sure files uploads to correct folder path
14. Add analytics feature with [PostHog](https://posthog.com/), tidy up project folder structure
15. Add delete functionality, for now just for the files
16. Add an onboarding page, check if user is signed in, if user has no drive create a new one with default folders
17. Prevent users to access unauthorized folders for them
18. Add disclaimer to footer
19. Add new functionality, create, rename and delete folders
