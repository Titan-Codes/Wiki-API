const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

// All other code below this....

app.route("/articles")

    .get(function (req, res) {
        Article.find(function (err, article) {
            if (!err) {
                res.send(article);
            } else {
                res.send(err);
            }
        })
    })

    .post(function (req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })

        newArticle.save(function (err) {
            if (!err) {
                res.send("Success!");
            } else {
                res.send(err);
            }
        });
    })

    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Successfully Deleted all articles!")
            } else {
                res.send(err);
            }
        });
    });

// Requests targetting all articles

app.route("/articles/:articleTitle")

    .get(function (req, res) {
        var articleName = req.params.articleTitle;
        Article.findOne({ title: articleName }, function (err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No Articles matching that title was found.");
            }
        });
    })

    .put(function(req,res){
        var articleName = req.params.articleTitle;
        Article.updateMany(
            {title: articleName},
            {title: req.body.title, content: req.body.content},
            // {overwrite: true},
            function(err){
                if (!err){
                    res.send("Successfully updated article!")
                } else {
                    res.send("Cant update: "+err);
                }
            }
        )
    })

    .patch(function(req,res){
        Article.updateOne({title: req.params.articleTitle},
            {$set: req.body},
            function(err){
                if (!err){
                    res.send("PATCH request successful!");
                } else {
                    res.send(err);
                }
            })
    })

    .delete(function(req,res){
        Article.deleteOne({title: req.params.articleTitle}, function(err){
            if (!err){
                res.send("Deleted article successfully!");
            } else {
                res.send(err);
            }
        })
    });

// All the code above this...
app.listen(process.env.PORT || 3000, function () {
    console.log("Server running...");
});