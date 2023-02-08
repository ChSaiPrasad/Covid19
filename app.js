const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "covid19India.db");

let bd = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000);
  } catch (e) {
    console.log(`DB Error:${e.message}`);
  }
};
initializeDBAndServer();
const convertDbObjectToResponseObjectState = (dbObject) => {
  return {
    stateId: dbObject.state_id,
    stateName: dbObject.state_name,
    population: dbObject.population,
  };
};
//get details
app.get("/states/", async (request, response) => {
  const getPlayersQuery = `
 SELECT
 *
 FROM
 state;`;
  const playersArray = await db.all(getPlayersQuery);
  response.send(
    playersArray.map((eachPlayer) =>
      convertDbObjectToResponseObjectState(eachPlayer)
    )
  );
});

//get with id
app.get("/states/:stateId/", async (request, response) => {
  const { stateId } = request.params;
  const Query = `
    select * from state where state_id= ${stateId};`;
  const st = await db.get(Query);
  response.send(st.map((each) => convertDbObjectToResponseObjectState(each)));
});

module.exports = app;
