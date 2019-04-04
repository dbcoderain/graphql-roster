GraphQL API for Roster Data
===========
1. Run `yarn install` on this folder.
2. Replace the values of the `.env` file with your unique variables. e.g. `DB_HOST=mongodb://localhost:27017/<database name>`

```
DB_HOST=<YOUR_MONGODB_HOST>
```
3. (Optional) Run `yarn load-data` if you wish to pre-load the mongodb with some test Squads, People, and Job Roles (Important: this will delete all mongo documents before inserting)

4. Run `yarn start` and open your browser to `http://localhost:4000/playground`


### Example Requests

#### query
```
query {
  People(name: "Dave") {
    name
    office
    role
    squads {
      name
      mission
    }
  }

  getPeople {
    _id
    name
    squads {
      name
    }
  }

  getSquads {
    _id
    name
    mission
    members {
      name
      office
      role
    }
  }
}
```




#### mutation

```
mutation {
  postPeople(input: { name: "Dave" office: "Belfast" role:  DEV
    	squads: "<id of squad here>"}) {
    _id
    name
  }
}
```
