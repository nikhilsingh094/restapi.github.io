const express = require("express");
const users = require("./dummy.json");
const fs = require("fs")

const app = express();
const PORT = 8000;

// miidleware

app.use(express.urlencoded({extended:false}))

//routes

// get all user
app.get("/api/users", (req, res) => {
  return res.json(users);
});

// get user by there id
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);
  return res.json(user);
});

app.post("/api/users",(req,res)=>{
    const body = req.body;
    users.push({...body,id:users.length + 1});
    fs.writeFile("./dummy.json",JSON.stringify(users),(err,data)=>{
        return res.json({status:'success',id:users.length})
    })
})

app.patch("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const body = req.body;

    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }
    users[userIndex] = { ...users[userIndex], ...body };

    fs.writeFile("./dummy.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update file" });
      }
      return res.json({ status: 'updated', id });
    });
  });

  app.delete("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);

    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }
    users.pop();
    fs.writeFile("./dummy.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update file" });
      }
      return res.json({ status: 'deleted'});
    });
  });



app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
