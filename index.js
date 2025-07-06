const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require('uuid'); // for unique blog id

const app = express();
const port = 8080;

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, 'public')));


// MySQL connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "sqll",
    password: "6969"
});

app.listen(port, () => {
    console.log("Server is listening");
});

// Home route - show all blogs
app.get("/", (req, res) => {
  const q = "SELECT * FROM blog_posts ORDER BY id DESC"; // Adjust table name if needed

  connection.query(q, (err, result) => {
    if (err) {
      console.log(err);
      return res.send("Error loading blogs");
    }
    res.render("index.ejs", { blogs: result });
  });
});

// Show new blog form
app.get("/blog/new", (req, res) => {
    res.render("new.ejs");
});

// Create new blog post
app.post("/blog", (req, res) => {
    let { title, content, author, image } = req.body;
    let id = uuidv4();
    let q = "INSERT INTO blog_posts (id, title, content, author, image) VALUES (?, ?, ?, ?, ?)";
    connection.query(q, [id, title, content, author, image], (err) => {
        if (err) throw err;
        res.redirect("/");
    });
});


// Show blog in detail
app.get("/blog/:id", (req, res) => {
    let { id } = req.params;
    let q = "SELECT * FROM blog_posts WHERE id = ?";
    connection.query(q, [id], (err, result) => {
        if (err) throw err;
        res.render("show.ejs", { blog: result[0] });
    });
});

// Show edit form
app.get("/blog/:id/edit", (req, res) => {
    let { id } = req.params;
    let q = "SELECT * FROM blog_posts WHERE id = ?";
    connection.query(q, [id], (err, result) => {
        if (err) throw err;
        res.render("edit.ejs", { blog: result[0] });
    });
});

// Update blog post
app.patch("/blog/:id", (req, res) => {
    let { id } = req.params;
    let { title, content, author, image } = req.body;
    let q = "UPDATE blog_posts SET title = ?, content = ?, author = ?, image = ? WHERE id = ?";
    connection.query(q, [title, content, author, image, id], (err) => {
        if (err) throw err;
        res.redirect("/blog/" + id);
    });
});



// Delete blog post
app.delete("/blog/:id", (req, res) => {
    let { id } = req.params;
    let q = "DELETE FROM blog_posts WHERE id = ?";
    connection.query(q, [id], (err) => {
        if (err) throw err;
        res.redirect("/");
    });
});
