# Simple Social

This app is a simplified example of a social media website. Based on the original concept of Twitter, posts are limited to 140 characters, and users can only post text - no photos. 

Accessible from: http://sm-frontend.s3-website.us-east-2.amazonaws.com

## Implemented Features

- Create an account with email, username, password, and an optional bio.
- Log in via username and password.
- Create posts by pressing "New Post" from anywhere in the app.
- Reply to existing posts by pressing the button in the lower-right corner of any post.
- Like or dislike posts by pressing the buttons in the lower-left corners of any post.
- View the difference between the number of likes and the number of dislikes on any post.
  - This works like Reddit upvotes and downvotes. If a post has 2 likes and 3 dislikes, '-1' will be displayed.
- View a user's profile by clicking on their username at the top of any post.
  - Follow or unfollow a user by pressing the "Follow" or "Unfollow" button at the top of their profile.
  - Add a profile picture by visiting your own profile and pressing "Choose a File..." at the top.
- Toggle between "All Posts" and "Followers" to view all posts globally, or only posts from users you follow, via the buttons at the top of the screen on the home page.
- Search for users via the search box at the top of the screen.

## Features to Come
- Follower counts on a user's profile.
- A button to take the user directly to their own profile.
  - Currently, users can visit their own profile by searching for their own username, or clicking on one of their own posts.
- Editing bios after user creation.

## Known Issues
- Cookies aren't working properly, so the user is logged out upon reloading the page.
- Most aspects of account creation are appropriately validated, but email isn't yet validated beyond ensuring that there is *some* input and that there are no spaces in said input.
- There is a noticeable delay when liking or disliking a post. This is because rather than assuming that the counts have only gone up or down by 1, the app queries for the counts from the backend.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.
