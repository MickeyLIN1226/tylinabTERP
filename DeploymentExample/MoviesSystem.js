const express = require("express");
const path = require("path");
const {escapeXML} = require("ejs");
const { MongoClient, ServerApiVersion } = require("mongodb");
const App = express();
const P = process.env.PORT || 7003;
const U = process.env.MONGO_CONNECTION_STRING;

if (!U) throw new Error("Set MONGO_CONNECTION_STRING.");

const M= new MongoClient(U, { serverApi: ServerApiVersion.v1 });
const C=M.db("CMSC335Deploy").collection("moviesCollection");

App.set("view engine", "ejs");
App.set("views", path.join(__dirname, "templates"));

App.get("/", (Q, R) => R.send("My Deployment"));

App.get("/insertMovies", async (Q, R) => {
    await M.connect();
    const A = [
        { name: "Batman", year: 2021, stars: 1.5 },
        { name: "Wonder Women", year: 2005, stars: 2 },
        { name: "When Harry Met Sally", year: 1985, stars: 5 },
        { name: "Hulk", year: 1985, stars: 5 },
    ];
    const N=await C.insertMany(A);
    R.send(`<h2>Inserted ${N.insertedCount} movies</h2>`);
});

App.get("/listMovies", async (Q, R) =>{
    await M.connect();
    const A=await C.find({}).toArray();
    const L = A.map(Mv => `${escapeXML(Mv.name)} (${escapeXML(Mv.year)})<br>`).join("");
    R.send(`${L}Found: ${A.length} movies`);
});

App.get("/clearCollection", async (Q, R) => {
    await M.connect();
    await C.deleteMany({});
    R.send("<h2>Collection Cleared</h2>");});

App.get("/getSummary", (Q, R) => R.render("summary", {year: 2025}));
App.use((E, Q, R, N) => {
    console.error(E.name);
    R.status(500).send("Request failed.");});


App.listen(P, "0.0.0.0");
