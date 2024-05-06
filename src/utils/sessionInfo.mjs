/*
01. What is sessionStore?
Ans: This is something we need, especially when we want to persist session data for the user. Because sometimes our server may go down unknown reasons and it may restart and when that happens all of our session data will be gone because by default express session stores it (session data) in memory. So what we want to do is we want to store this in a database. So that way, it can be persisted whenever our server goes down. And if it goes back up, the sessionStore will have that session data there and express session will look in that sessionStore in the database to grab the session data and restore it for the user.

Earlier We actually showed how the memory sessionStore looks like and how it stores data. We will show again. Inside our API users endpoint is where we have this being logged. So what this does is it looks for the session ID and if there are an errors, just throw errors. 
*/