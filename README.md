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

### Endpoint 1: Create Household
Method: `POST`
  
```
/create-household
```

Parameter
| Field | Type | Description |
| --- | --- | --- |
| housing_type | text | Housing type (Options: Landed, Condominium, HDB) |

Request Example
```
[
	{
    		"housing_type": "Landed"
	},
	{
		"housing_type": "Condominium"
	},
	{
		"housing_type": "HDB"
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
| housing_type | text | Housing type (Options: Landed, Condominium, HDB) |
| member_name | character (256) | Name |
| member_gender | character (1) | Gender (Options: M, F) |
| member_marital_status | character (25) | Marital Status (Options: Single, Married, Widowed, Divorced) |
| member_spouse | character (25) | Spouse name |
| member_occupation_type | character (25) | Occupation (Options: Unemployed, Student, Employed) |
| member_annual_income | numberic (15, 2) | Annual income |
| member_dob | date | YYYY-MM-DD |
		
Request Example
```
[
	{
		"housing_type": "HDB",
		"member_name": "Evon",
		"member_gender": "F",
		"member_marital_status": "Married",
		"member_spouse": "Alvin",
		"member_occupation_type": "Employed",
		"member_annual_income": 2000,
		"member_dob": "1991-12-11"
	},
		{
		"housing_type": "HDB",
		"member_name": "Alvin",
		"member_gender": "M",
		"member_marital_status": "Married",
		"member_spouse": "Evon",
		"member_occupation_type": "Employed",
		"member_annual_income": 2000,
		"member_dob": "1991-01-01"
	}
]
```

Response Example
```
Family member added to household successfully.
```

# Built With
- Node.js
- Express.js
- PostgreSQL
