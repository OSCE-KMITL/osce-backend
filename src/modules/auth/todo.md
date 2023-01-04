### Auth feature tasks

- Sign-in
  - [ ] update Account entity attribute with google_id , token_version
  - [ ] login with email ,password when logged in successful return response with attach cookies name jwt-token to client.
  - [x] Maybe attach role [Optional]
  
- Sign-out
  - [ ] removed jwt form client cookie 
  - [ ] increment token_version for security
- For Authorized
  - [ ] setup middleware and get token from req-header for controller / resolver [Authorized]
  
- [ ] Google ?