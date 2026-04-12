what is a middleware?

-middleware provies a way to add a reuse common functionality across applications routes and endpoints

-it executes duting the request response cycle
-it can modify the request and response objects
-it can end the request resposne cycle
-can call the next middleware in stack
-can be application level, route level or route-specific

-middleware is written using app.use so that it can be used for all types of reuquests like get, post, put, delete, etc
