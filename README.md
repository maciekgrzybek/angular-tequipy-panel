# AngularTequipyPanel

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.5.

## Setup and Installation

Before running the project, you'll need to install dependencies for both the client and server:

```bash
# Install client dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

## Development server

To start a local development server, run:

```bash
ng run dev
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The mocked API is under `http://localhost:3000/`. This command will run both frontend and the mocked API.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use:

```bash
ng test
```

## Project Architecture and My Implementation Choices

### Backend Implementation

- I've set up the backend using json-server to provide a mocked API
- I kept it simple for this task, but in a real-world scenario, I'd definitely add functionality to track the history of changes

### Architecture Decisions

#### Why I Skipped SSR/SSG

- I decided not to implement Server-Side Rendering (SSR) or Static Site Generation (SSG) since this is an internal admin panel. We don't need the SEO benefits or the slightly faster initial load that these approaches would provide.

#### My Approach to the Design System

- I created a "design-system" folder for reusable UI components
- Yeah, it might seem like overkill for a small project like this, but it's how I'd approach a real-world app. Having a consistent set of UI building blocks makes development so much faster as the app grows!

#### How I Handled State Management

- I separated the employee data fetching service from the state management store
- This decoupling makes the code easier to maintain and test - something I've found super helpful on larger projects

#### How I Structured the Project

- I organized the app into feature modules rather than technical divisions
- UI components live in the "pages" folder
- I find this approach makes the codebase much more intuitive to navigate, especially when onboarding new team members

### Testing Approach

- I've implemented unit tests for the Dashboard component
- In a real project, I'd add:
  - E2E tests for the main user flows
  - More unit and integration tests throughout
  - Some handy test utilities for rendering components with the right setup
  - Helper functions to make element queries in tests less painful

### API Tweaks

- I updated the offboard endpoint to use "employees" instead of "users" for consistency (looked like a typo in the original spec)

## What I'd Add Given More Time

Here's what I'd improve if this were a production app:

- **Data Caching**: I'd implement caching to speed things up, especially once we have more data
- **UX Improvements**:
  - Quick-copy buttons for user emails and IDs (super handy for admin panels!)
  - Column filtering in the dashboard (I've worked on similar admin panels before, and this is always requested)
- **Better Error Handling**: I'd hook up Rollbar or Sentry to catch and report issues
- **Design System Expansion**:
  - I'd move the input components and snackbar into the design system
  - Add phone number input with selectable country code prefixes
- **Component Refinements**:
  - Extract those form inputs into reusable components
  - Move more UI logic from the pages into the feature modules
