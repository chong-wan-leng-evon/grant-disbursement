# Q2. Backend Technical Assessment - Government Grant Disbursement API
This project consists of RESTful API that would help to user to decide on the groups of people who are eligible for various upcoming government grants.

# Getting Started
- Using GitHub Desktop
  - Press on the "code" button (in green) to locate and copy the HTTPS url of this repository
  - Within GitHub Desktop application, locate "Add" button -> "Clone repository" button. Provide the HTTPS url under the "url" tab and choose a local path to clone the project into and press on the "clone" button to clone it.

- Without the use of GitHub Desktop
  - Press on the "code" button (in green), then press on the "download zip" button
  - Choose a local path to save the project into

# Prerequisites
Database: PostgreSQL


## API End-Points

### Create Household
Method: POST
  
```
/api/create-household
```

| Field         | Type          | Description |
| ------------- | ------------- |
| housingType   | text          | Housing type (Possible options: Landed, Condominium, HDB) |
  

# Built With
- Node.js
- Express.js
- PostgreSQL
