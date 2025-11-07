```mermaid
%%GET all notes page request

sequenceDiagram
    participant U as User/Browser

    box Express Server
    participant M as Middleware
    participant R as Router
    participant NC as Note Controller
    participant MD as Note Model
    end

    box Mongo Database
    participant N as Notes
    participant Us as Users
    participant S as Sessions
    end

    note over Us, S: Used for session management<br/>in middleware

    %%flow
    %%send request
    U ->> M: GET "/notes", cookie session ID
    activate U
    activate M

    %%middleware process
    note right of M: Processes request, parses cookies.<br/>(See middleware process detail in session-middleware-flow file)

    M ->> R: Routes the request to the correct route handler
    deactivate M
    activate R

    %route handler
    R ->> M: Checks user credentials
    deactivate R
    activate M
    M --> M: Calls req.isAuthenticated()
    note right of M: req.isAuthenticated() finds req.user to confirm if user signed in.
    M --> M: req.isAuthenticated() returns true (signed in) of false (not signed in)
    alt User signed in
        M ->> R: Returns control to note route
        activate R
        R ->> NC: Handles GET all notes request
        deactivate R
        activate NC
        NC ->> MD: await Note.find({ user: req.user.id }).sort({ date: "desc" }).lean()
        activate MD
        note over NC, MD: find() gets the documents,<br/>sort() orders them by date,<br/>lean() converts them to plain JS objects
        
        MD ->> N: Sends a query of find() method to Notes collection
        activate N
        N -->> MD: Returns an array of Mongoose objects
        deactivate N
        MD -->> NC: Returns an array of plain JS objects
        deactivate MD
        NC -->> U:Renders the all notes page with the user's created notes 
        deactivate NC
        note over NC, U: Status code: 200 OK <br/> Body: HTML content after rendering
        
    else User not sign in
        M --> M: req.flash("error_msg", "Not Authorized.")
        note right of M: Sets error message to req.session.flash.<br/>Session updated at the end of request based on req.session.
        M -->> U: Redirects to sign in page
        deactivate M
        deactivate U
        note over M, U: Status code: 302 Found<br/>Header - Location: /auth/signin
        
    end

```