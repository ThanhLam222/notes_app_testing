```mermaid
%%GET edit notes form request

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
    U ->> M: GET "/notes/edit/:id", cookie session ID
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
        R ->> NC: Handles GET edit note request
        deactivate R
        activate NC
        NC ->> MD: await Note.findById(req.params.id).lean()
        activate MD
        note over NC, MD: findById() gets the document,<br/>lean() converts it to plain JS object
        
        MD ->> N: Sends a query of findById() method to Notes collection
        activate N
        N -->> MD: Returns the Mongoose object
        deactivate N
        MD -->> NC: Returns the plain JS object
        deactivate MD
        NC --> NC: Checks if owner

        alt Is owner
            NC -->> U: Renders edit note form with found note
            note over NC, U: Status code: 200 OK <br/> Body: HTML content after rendering
        else Is not owner
            NC --> NC: req.flash("error_msg", "Not Authorized").
            note right of NC: Sets error message to req.session.flash.<br/> Session updated at the end of request based on req.session.
            NC -->> U: Redirects to the all notes page
            deactivate NC
            note over NC, U: Status code: 302 Found<br/>Header - Location: /notes
        end
        
    else User not sign in
        M --> M: req.flash("error_msg", "Not Authorized.")
        note right of M: Sets error message to req.session.flash.<br/>Session updated at the end of request based on req.session.
        M -->> U: Redirects to sign in page
        deactivate M
        deactivate U
        note over M, U: Status code: 302 Found<br/>Header - Location: /auth/signin
        
    end

```