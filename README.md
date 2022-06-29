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
- PostgreSQL: Download (https://www.postgresql.org/download/) and create an account
    - During account creation set password as rootUser
    - open up connection.js to chang the cofiguration according to your postgersql server, if required
- Postman: Download (https://www.postman.com/downloads/) and create an account

# Run the project
### npm install
- In the project directory, from the terminal run npm install

### node api.js
- In the project directory, from the terminal node api.js

## API End-Points
Default port number is 3000
```
http://localhost:{based on the port number set in last line of api.js}
```

### Datebase
#### Create tables in PostgreSQL
SQL 1:
```
CREATE TABLE IF NOT EXISTS household
(
    id serial primary key,
    household_type text
)
```

SQL 2:
```
CREATE TABLE IF NOT EXISTS household_family
(
    id serial primary key,
    household_id integer NOT NULL
)
```

SQL 3:
```
CREATE TABLE IF NOT EXISTS household_family_member
(
    id serial primary key,
    household_family_id integer,
    member_name character(256),
    member_gender character(1),
    member_marital_status character(25),
    member_spouse character(25),
    member_occupation_type character(25),
    member_annual_income numeric(15,2),
    member_dob date
)
```

### Endpoint 1: Create Household
Method: `POST`

Data format: Json (In postman: Body -> raw -> Json)
  
```
/create-household
```

Parameter
| Field | Type | Description |
| --- | --- | --- |
| household_type | text | Housing type (Options: Landed, Condominium, HDB) |

Request Example
```
[
	{
    		"household_type": "Landed"
	},
	{
		"household_type": "Condominium"
	},
	{
		"household_type": "HDB"
	}
]
```

Response Example
```
Household created successfully.
```
  
### Endpoint 2: Add family member to household
Method: `POST`

```
/add-member
```

Parameter
| Field | Type | Description |
| --- | --- | --- |
| household_type | text | Household type (Options: Landed, Condominium, HDB) |
| member_name | character (256) | Name |
| member_gender | character (1) | Gender (Options: M, F) |
| member_marital_status | character (25) | Marital Status (Options: Single, Married, Widowed, Divorced) |
| member_spouse | character (25) | Spouse name |
| member_occupation_type | character (25) | Occupation (Options: Unemployed, Student, Employed) |
| member_annual_income | numberic (15, 2) | Annual income |
| member_dob | date | YYYY-MM-DD |
		
Request Example
```
SQL 1:
[
	{
		"household_type": "Landed",
		"member_name": "Name1",
		"member_gender": "F",
		"member_marital_status": "",
		"member_spouse": "",
		"member_occupation_type": "Employed",
		"member_annual_income": 4000,
		"member_dob": "1991-12-11"
	}
]
```

```
SQL 2:
[
	{
		"household_type": "Condominium",
		"member_name": "Name2",
		"member_gender": "M",
		"member_marital_status": "",
		"member_spouse": "",
		"member_occupation_type": "Employed",
		"member_annual_income": 100000,
		"member_dob": "1991-12-11"
	}
]
```

```
SQL 3:
[
	{
		"household_type": "HDB",
		"member_name": "Evon",
		"member_gender": "F",
		"member_marital_status": "Married",
		"member_spouse": "Alvin",
		"member_occupation_type": "Employed",
		"member_annual_income": 4000,
		"member_dob": "1991-12-11"
	},
	{
		"household_type": "HDB",
		"member_name": "Alvin",
		"member_gender": "M",
		"member_marital_status": "Married",
		"member_spouse": "Evon",
		"member_occupation_type": "Employed",
		"member_annual_income": 5000,
		"member_dob": "1991-01-01"
	},
	{
		"household_type": "HDB",
		"member_name": "Emre",
		"member_gender": "M",
		"member_marital_status": "Single",
		"member_spouse": "",
		"member_occupation_type": "Student",
		"member_annual_income": 0,
		"member_dob": "2021-08-18"
	},
	{
		"household_type": "HDB",
		"member_name": "Amy",
		"member_gender": "M",
		"member_marital_status": "Widowed",
		"member_spouse": "",
		"member_occupation_type": "Unemployed",
		"member_annual_income": 0,
		"member_dob": "1955-07-20"
	}
]
```

Response Example
```
Family member added to household successfully.
```

### Endpoint 3: List all the households in the database
Method: `GET`

```
/list-household
```

Response Example
```
[
    {
        "household_type": "Landed",
        "member_name": "Name1",
        "member_gender": "F",
        "member_marital_status": "",
        "member_spouse": "",
        "member_occupation_type": "Employed",
        "member_annual_income": "4000.00",
        "member_dob": "1991-12-10T16:00:00.000Z"
    },
    {
        "household_type": "HDB",
        "member_name": "Evon",
        "member_gender": "F",
        "member_marital_status": "Married",
        "member_spouse": "Alvin",
        "member_occupation_type": "Employed",
        "member_annual_income": "4000.00",
        "member_dob": "1991-12-10T16:00:00.000Z"
    },
    {
        "household_type": "HDB",
        "member_name": "Alvin",
        "member_gender": "M",
        "member_marital_status": "Married",
        "member_spouse": "Evon",
        "member_occupation_type": "Employed",
        "member_annual_income": "5000.00",
        "member_dob": "1990-12-31T16:00:00.000Z"
    },
    {
        "household_type": "HDB",
        "member_name": "Emre",
        "member_gender": "M",
        "member_marital_status": "Single",
        "member_spouse": "",
        "member_occupation_type": "Student",
        "member_annual_income": "0.00",
        "member_dob": "2021-08-17T16:00:00.000Z"
    },
    {
        "household_type": "HDB",
        "member_name": "Amy",
        "member_gender": "M",
        "member_marital_status": "Widowed",
        "member_spouse": "",
        "member_occupation_type": "Unemployed",
        "member_annual_income": "0.00",
        "member_dob": "1955-07-19T16:30:00.000Z"
    },
    {
        "household_type": "Condominium",
        "member_name": "Name2",
        "member_gender": "M",
        "member_marital_status": "",
        "member_spouse": "",
        "member_occupation_type": "Employed",
        "member_annual_income": "100000.00",
        "member_dob": "1991-12-10T16:00:00.000Z"
    }
]
```


### Endpoint 4: Show the details of a household in the database by household family id
Method: `GET`

```
/show-household/{id}
```

Parameter
| Field | Type | Description |
| --- | --- | --- |
| household_family_id | integer | Id representing a household family |

Request Example
```
/show-household/1
```

Response Example
```
[
    {
        "household_type": "Landed",
        "member_name": "Name1",
        "member_gender": "F",
        "member_marital_status": "",
        "member_spouse": "",
        "member_occupation_type": "Employed",
        "member_annual_income": "4000.00",
        "member_dob": "1991-12-10T16:00:00.000Z"
    }
]
```

### Endpoint 5: Search for households and recipients of grant disbursement
Method: `GET`

Assumption: Each search is for one grant scheme only

```
/search-grant/{household_type}/{annual_income}/{children_age}
```

Baby Sunshine Grant
Assumption: Only search for family member who is younger than 5 year old

Request Example
```
/search-grant/nill/nil/less5
```

Parameter
| Field | Type | Description |
| --- | --- | --- |
| household_type | text | Household type (Options: Landed, Condominium, HDB) |
| annual_income | text | Total household income (e.g. less100000) |
| children_age | text | Age of children (e.g. less5) |

Response Example
```
[
    {
        "id": 21,
        "household_family_id": 5,
        "member_name": "Emre",
        "member_gender": "M",
        "member_marital_status": "Single",
        "member_spouse": null,
        "member_occupation_type": "Student",
        "member_annual_income": null,
        "member_dob": "2019-12-10T16:00:00.000Z"
    }
]
```


Yolo Grant
Request Example
```
/search-grant/HDB/less100000
```

Parameter
| Field | Type | Description |
| --- | --- | --- |
| household_type | text | Household type (Options: Landed, Condominium, HDB) |
| annual_income | text | Total household income (e.g. less100000) |

Response Example
```
[
    {
        "household_family_id": 8,
        "total_annual_income": "150.00"
    }
]
```

### Endpoint 6: Delete household - Remove Household and family members
Method: `DELETE`

```
delete-household/{household_family_id}
```

Request Example
```
/delete-household/10
```

Parameter
| Field | Type | Description |
| --- | --- | --- |
| household_family_id | integer | Id representing a household family |

Response Example
```
Household and family members removed successfully the household type.
```


### Endpoint 7: Delete Family Member - Remove Family Member from the Household
Method: `DELETE`

```
delete-member/{household_family_id}/{household_family_member_id}
```

Request Example
```
/delete-member/10/16
```

Parameter
| Field | Type | Description |
| --- | --- | --- |
| household_family_id | integer | Id representing a household family |
| household_family_member_id | integer | Id representing the member to be removed |

Response Example
```
Family member removed successfully from the household.
```

# Built With
- Node.js
- Express.js
- PostgreSQL
