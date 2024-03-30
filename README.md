# Issue blog

Issue blog is a blog platform built on top of GitHub repository issues. Use the issue feature to compose and manage posts.

I wrote this as a practice. This is not intended for serious work. Check out my Next 13 blog [cheetosysst/maraho](https://github.com/cheetosysst/maraho), or my future static blog project [cheetosysst/grandis](https://github.com/cheetosysst/grandis), if you're interested.

I wrote some notes in this README, to document some thoughts and decisions I made.

[TOC]

## Getting Started

1. Register an OAUTH app on GitHub
   You can find instructions [here](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app).
2. Clone the repo

    ```sh
    git clone https://github.com/cheetosysst/issue-blog
    ```

3. Create environment variables
   Copy `.env.example` as `.env.local`, and fill in the variables.
   You can find the client id and secret in the oauth app you just created.
   Point `REPO` to the repo you want to use.
    > The repo **must** be a public repo.
4. Run the project

    ```bash
    pnpm i
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Design

See [Feature](./docs/design.md) for detail.

## Features

-   GitHub Authentication
-   Post Management
    -   Create
    -   Edit
    -   Delete (Close issue)

## Web Vital
