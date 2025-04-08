const express = require("express")
const fs = require('fs');
const db = require("./db");
const app = express() // Class 
const compression = require('compression');

const aboutData = [
    {
        id: 1,
        name: "sahil",
        "city": "hisar"
    },
    {
        id: 2,
        name: "rohan",
        "city": "delhi"
    },
    {
        id: 3,
        name: "isha",
        "city": "kolkata"
    },
]
const blogData = [
    {
        id: 1,
        heading: "HTTP headers",
        description: "HTTP headers let the client and the server pass additional information with a message in a request or response."
    },
    {
        id: 2,
        heading: "HTTP messages",
        description: "HTTP messages are the mechanism used to exchange data between a server and a client in the HTTP protocol."
    },
    {
        id: 3,
        heading: "Parameters and URL Query",
        description: {
            RouteParameter: "value that is part of the URL path.",
            Query: "a pair of key=value that is present after the URL path immediately after the question sign ?"
        }
    },
]
const serviceData = [
    {
        id: 1,
        name: "sahil"
    },
    {
        id: 2,
        name: "rohan",
    },
    {
        id: 3,
        name: "isha",
    },
]
// app.use(compression());
// Server Function 
// Rest Api
app.get(`/index.html`, (req, res) => {
    console.log("request", req)
    // res.setHeader('Content-Type', 'text/html');
    const data = fs.readFileSync('index.html')
    res.statusCode = 200;
    res.end(data.toString())
})
app.get('/about', (req, res) => {
    console.log("request", req)
    return res.status(200).json({ data: aboutData })
})
app.get('/blog', (req, res) => {
    console.log("request", req)
    return res.status(200).json({ data: blogData })
})
app.get('/service', (req, res) => {
    console.log("request", req)
    return res.status(200).json({ data: serviceData })
})

// app.get("/data", (req, res) => {
//     try {
//         const { skip = 0, limit = 100 } = req.query
//         const skipInt = parseInt(skip)
//         const limitInt = parseInt(limit)
//         const result = db.slice(skipInt, skipInt + limitInt)
//         return res.status(200).json({ data: result, count: db.length })
//     } catch (error) {
//         return res.status(500).json({ error: "internal server error" })
//     }
// })

app.get("/data", (req, res) => {
    try {
        const { skip = 0, limit = 100, search, sort, sortBy = "id" } = req.query;

        const skipInt = parseInt(skip);
        const limitInt = parseInt(limit);

        let output = db.slice(skipInt, skipInt + limitInt);

        if (search) {
            output = output.filter(item =>
                Object.values(item)
                    .filter(value => typeof value === "string")
                    .some(value => value.toLowerCase().includes(search.toLowerCase()))
            );
        }

        if (sort) {
            output = output.sort((a, b) => {
                const aValue = a[sortBy];
                const bValue = b[sortBy];

                if (typeof aValue === "string" && typeof bValue === "string") {
                    // console.log(aValue, " aValue", "bValue ", bValue)
                    return sort === "asc"
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                } else if (typeof aValue === "number" && typeof bValue === "number") {
                    return sort === "asc" ? aValue - bValue : bValue - aValue;
                }

                return 0;
            });
        }

        return res.status(200).json({ data: output });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
});

app.get("/data/all", (req, res) => {
    try {
        return res.status(200).json({ data: db, count: db.length })
    } catch (error) {
        return res.status(500).json({ error: "internal server error" })
    }
})

app.listen(4000, () => {
    console.log("server is running")
})

