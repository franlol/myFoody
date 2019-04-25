# MyFoody

## Description

MyFoody is an application where you can share your food recipes with other people. At the same time, you can find recipes depending on what you want.

Check the [deploy!](https://myfoody.herokuapp.com/auth/login)
 
 #### Demo:

 ![demo](https://github.com/franlol/myFoody/blob/master/demo.gif)

## User Stories

- **Login** - As a user I want to be able to log in on the webpage so that I can get back to my account
- **Sign up** - As a user I want to sign up on the webpage so that I can see all the events that I could attend
- **Logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account

- **Home** - As a user I want to check all the new recipes so that I can see all the recipies.
- **Search** - As a user I want to be able to search recipes so that I can found what I want faster.
- **Filters** - As a user I want to filter recipes so that I can focus on what i need.

- **Add To Favs** - As a user I want to store my favourite recipes so that I can acces faster to them.
- **Remove Favories** - As a user I want to delete my favororite receptes from my favs.
- **See Favorites** - As a user I want to be able to see my favorite recipes in a list

- **Add a Recipe** - As a user i want to add a recipes so that I can share with others.
- **Edit a Recipe** - As a user I want to edit a recipe so that I can update data.
- **Remove a Recipe** - As a user I want to remove a recipe so that I dont want it anymore.

## Backlog

List of other features outside of the MVPs scope

User profile:
- Fav slide
- Own Slide
- Like totales
- Followers
- Gamificación

Geo Location:
- What can I eat in my zone?

Buy
- I like this recipe. Redirect me to amazon plz.

Home
- More Filters.
- Rankings


## ROUTES:

//AUTH
- GET /auth/signup
  - redirects to / if user logged in
  - renders the signup form (with flash msg)
- POST /auth/signup
  - redirects to / if user logged in
  - body:
    - username
    - email
    - password
- GET /auth/login
  - redirects to / if user logged in
  - renders the login form (with flash msg)
- POST /auth/login
  - redirects to / if user logged in
  - body:
    - username
    - password
- POST /auth/logout
  - body: (session Id)

//HOME
- GET /
  - renders the recipes list
  - redirect to /auth/login if user is anonymous

//RECIPE ADD
- GET /recipes/add
    - redirect to /auth/login if user is anonymous
    - renders page
- POST /recipes/add
  - redirects to / if user is anonymous
  - body: 
    - title
    - image_url
    - author_id
    - classification []
    - ingredients []
    - cooking time
    - description
        
//RECIPES EDIT
- GET /recipes/:id/edit
    - redirect to /auth/login if user is anonymous
    - renders the page
-POST /recipes/:id/edit
    - redirects to / if user is anonymous
    - redirects to / if user is not the owner
    - body:
        - title
        - image_url
        - author_id
        - classification []
        - ingredients []
        - cooking time
        - description
        - views
        - likes

- POST /recipes/:id/delete
- redirects to / if user is anonymous
- redirects to / if user is not the owner
    - body:
        - id

//FAVS
- GET /user/:id
    - Dont show favourites if the user :id dont match session id
    - render user profile

//FAVS ADD/REMOVE
- POST /recipes/:id/favourites/
    - redirects to / if user is anonymous
    - body:
        - id

//SEARCH
- GET /?search
    - query:
        - string

//FILTER
- GET /?filter
    - query
        - String

## Models

User model
 
```
username: String
password: String
id: ObjectId
favRecipes: [String]
ownRecipes: [String]
likes: Number
```

Recipe Model

```
id: ObjectId
photoUrl: String
authorId: ObjectId
classification: [String]
ingredients: [String]
cookingTime: Number
description: String
views: Number
likes: Number
``` 

Comment Model

```
id: ObjectId
timestamp: Date
like: Number
dislike: Number
comment: String
authorId: ObjectId
recipeId: ObjectId

### Git

[Repository Link](https://github.com/franlol/myFoody)

[Deploy Link](http://heroku.com)

### Slides

[Slides Link](http://slides.com)
