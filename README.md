# Mock-Mailer
## A node app which immitates an email sending service
### Sends emails via two mock providers
# Installation
* Install node.js
* Initialize node.js ```npm init -y```
* Install neccessary dependencies
  ```
  npm install express axios
  ```
* Change the provider url within provider.js
  for eg : ```https://example.mockapi.io/send/providerA```
## Run Server
  ```
  node server.js
  ```
## Methods
### POST
  * _send-mail_ : Sends a mail with detail attached with header
  ```
    curl -X POST http://localhost:3000/send-email \
    -H "Content-Type: application/json" \
    -d '{"id": "1", "to": "test@example.com", "subject": "Hello", "body": "Hello, world!"}'
  ```
### GET
  * _email-status/id_ : Returns the status of mail with given id
  ```
  curl http://localhost:3000/email-status/1
  ```
  * _emails_ : Displays all the mail sent 
  ```
  curl http://localhost:3000/emails
  ```

  
