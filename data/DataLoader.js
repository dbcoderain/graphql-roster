const { readFileSync } = require('fs')
const resolvers = require('../resolvers')
const squadsData = readFileSync('./data/squads.json')
const peopleData = readFileSync('./data/people.json')
const jobRoleData = readFileSync('./data/jobRole.json')

module.exports = {

  async loadData({ db }) {
    console.log('************ DELETING ALL DATA **************');
    db.collection('JobRole').deleteMany({});
    db.collection('People').deleteMany({});
    db.collection('Squads').deleteMany({});

    console.log('************ LOADING DATA **************');
    const jobRolesJSON = JSON.parse(jobRoleData);
    const squadsJSON = JSON.parse(squadsData);
    const peopleJSON = JSON.parse(peopleData);

    console.log('----------- INSERT JOB ROLES -----------');
    for (let i = 0; i < jobRolesJSON.length; i++) {
      const args = {
        input: {
          ...jobRolesJSON[i]
        }
      }
      const newJobRole = await resolvers.Mutation.postJobRole(null, args, { db });
      console.log(`saved... ${JSON.stringify(newJobRole)}`);
    }

    console.log('----------- INSERT SQUADS -----------');
    for (let i = 0; i < squadsJSON.length; i++) {
      const args = {
        input: {
          ...squadsJSON[i]
        }
      }
      const newSquad = await resolvers.Mutation.postSquad(null, args, { db });
      console.log(`saved... ${JSON.stringify(newSquad)}`);
    }

    console.log('----------- INSERT PEOPLE -----------');
    const jobRoles = await resolvers.Query.getJobRoles(null, null, { db });
    for (let i = 0; i < peopleJSON.length; i++) {
      const jobRole = jobRoles.filter(x => x.name === peopleJSON[i].jobRole)[0];
      const squadsArray = peopleJSON[i].squads.split(',');
      const squads = [];
      for (let x = 0; x < squadsArray.length; x++) {
        const squad = await resolvers.Query.Squads(null, { name: squadsArray[x] }, { db });
        squads.push(squad._id);
      }
      const args = {
        input: {
          name: peopleJSON[i].name,
          office: peopleJSON[i].office,
          jobRole: jobRole._id,
          squads: squads
        }
      }
      const newPeople = await resolvers.Mutation.postPeople(null, args, { db });
      console.log(`SAVED.... ${JSON.stringify(newPeople)}`);
    }
  }

}