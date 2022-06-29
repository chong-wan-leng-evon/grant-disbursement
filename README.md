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
[
	{
		"household_type": "HDB",
		"member_name": "Evon",
		"member_gender": "F",
		"member_marital_status": "Married",
		"member_spouse": "Alvin",
		"member_occupation_type": "Employed",
		"member_annual_income": 2000,
		"member_dob": "1991-12-11"
	},
		{
		"household_type": "HDB",
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

### Endpoint 3: List all the households in the database
Method: `GET`

```
/list-household
```

Response Example
```
[
    {
        "household_type": "HDB",
        "member_name": "Evon",
        "member_gender": "F",
        "member_marital_status": "Married",
        "member_spouse": "Alvin",
        "member_occupation_type": "Employed",
        "member_annual_income": "2000.00",
        "member_dob": "1991-12-10T16:00:00.000Z"
    },
    {
        "household_type": "HDB",
        "member_name": "Alvin",
        "member_gender": "M",
        "member_marital_status": "Married",
        "member_spouse": "Evon",
        "member_occupation_type": "Employed",
        "member_annual_income": "2000.00",
        "member_dob": "1990-12-31T16:00:00.000Z"
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

Response Example
```
[
    {
        "household_type": "HDB",
        "member_name": "Evon",
        "member_gender": "F",
        "member_marital_status": "Married",
        "member_spouse": "Alvin",
        "member_occupation_type": "Employed",
        "member_annual_income": "2000.00",
        "member_dob": "1991-12-10T16:00:00.000Z"
    },
    {
        "household_type": "HDB",
        "member_name": "Alvin",
        "member_gender": "M",
        "member_marital_status": "Married",
        "member_spouse": "Evon",
        "member_occupation_type": "Employed",
        "member_annual_income": "2000.00",
        "member_dob": "1990-12-31T16:00:00.000Z"
    }
]
```

### Endpoint 5: Search for households and recipients of grant disbursement
Method: `GET`
Assumption: Each search is for one grant scheme only

```
/search-grant/{household_type}/{annual_income}
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
