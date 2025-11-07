```mermaid
%% GET sign in form request

sequenceDiagram
    participant U as User/Browser

    box Express Server
    participant M as Middleware
    participant R as Router
    participant AC as Auth Controller
    end

    box Mongo Database
    participant S as Sessions
    end

    note right of S: Used for session management in middleware
    
    %%flow
    %%send request
    U ->> M: GET "/auth/signin", cookie session ID
    activate U
    activate M

    %%middleware process
    note right of M: Processes request, parses cookies<br/>and session ID if any.<br/>(See middleware process detail in session-middleware-flow file)

    M ->> R: Routes the request to the correct route handler
    deactivate M
    activate R

    %route handler
    R ->> AC: Handles GET sign in request
    deactivate R
    activate AC
    AC -->> U: render sign in page
    deactivate AC
    deactivate U
    note over AC, U: Status code: 200 OK <br/> Body: HTML content after rendering
    
    
```
