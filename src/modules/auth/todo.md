### Auth feature tasks

- auth
  - [x] setup middleware for auth token
  - [x] setup middleware for authorized user
  - [ ] refactoring , code cleaning


- Sign-in
  - [ ] update Account entity attribute with google_id , token_version
  - [x] login with email ,password when logged in successful send jwt to fronted
  - [x] Maybe attach role [Optional]
  
- Sign-out
  - [ ] removed jwt form client cookie 
  - [ ] increment token_version for security
- For Authorized
  - [ ] setup middleware and get token from req-header for controller / resolver [Authorized]
  
- [ ] Google ?