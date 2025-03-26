# safecity
// Install Dependency for Frontend  

--  npm install  
--  npx create-react-app@latest frontend  
--  npm install react-router-dom  
--  npm install axios  
--  npm install jwt-decode  
--  npm install chart.js react-chartjs-2  

// Install Dependency for Backend   

-- npm init -y  
-- npm install express mongoose bcryptjs jsonwebtoken dotenv cors body-parser  


// Insert Values for Backend  
In terminal run  

-- mongosh  
-- use Safecity  

Run the following code to create options  

For locations  
db.locations.insertOne({ name: "North" })  
db.locations.insertOne({ name: "South" })  
db.locations.insertOne({ name: "East" })  
db.locations.insertOne({ name: "West" })  
db.locations.insertOne({ name: "NorthEast" })  
db.locations.insertOne({ name: "NorthWest" })  
db.locations.insertOne({ name: "SouthEast" })  
db.locations.insertOne({ name: "SouthWest" })  

For categories  
db.categories.insertOne({ name: "dangerous" })  
db.categories.insertOne({ name: "neutral" })  
db.categories.insertOne({ name: "safe" })  

For status  
db.statuses.insertOne({ name: "Under Investigation" })  
db.statuses.insertOne({ name: "Resolved" })  
db.statuses.insertOne({ name: "Dismissed" })  
