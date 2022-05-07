const express = require("express");
const mongoose = require("mongoose");
const Employee = require("./model/Employee");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = "mongodb://localhost:27017/CRUD_API";

const conn = async () => {
    try {
        await mongoose.connect(db);
        console.log("Connected to DB");
    } catch (error) {
        console.log(error);
    }
};

conn();

//Get All Employees
app.get("/employees", (req, res) => {
    Employee.find({}, (err, data) => {
        res.send(data);
    });
});

//Get Employee by Employee ID
app.get("/employee/:empID", (req, res) => {
    const e = req.params.empID;
    Employee.findOne({ empID: e }, (err, data) => {
        if (data) {
            res.send(data);
        } else {
            res.send("Employee not found");
            console.log("Error", err);
        }
    });
});

//Add new employee
app.post("/employee/add", async (req, res) => {
    const emp = new Employee({
        name: req.body.name,
        empID: req.body.empID,
        location: req.body.location,
        salary: req.body.salary,
    });
    await emp.save((err, data) => {
        if (data) {
            res.status(201).json({
                msg: "Employee Added",
                addedEmployee: data,
            });
        } else {
            console.log(err);
        }
    });
});

//Update employee
app.put("/employee/update/:empID", (req, res) => {
    const emp = {
        name: req.body.name,
        empID: req.body.empID,
        location: req.body.location,
        salary: req.body.salary,
    };

    var e = req.params.empID;
    Employee.findOneAndUpdate(
        { empID: e },
        { $set: emp },
        { new: true },
        (err, data) => {
            if (data) {
                res.status(201).json({
                    msg: "Employee Updated",
                    updatedEmployee: data,
                });
            } else {
                console.log(err);
            }
        }
    );
});

//Delete Employee
app.delete("/employee/delete/:empID", (req, res) => {
    var e = req.params.empID;
    Employee.findOneAndDelete({ empID: e }, (err, data) => {
        if (data) {
            res.status(201).json({
                msg: "Employee Deleted",
                deletedEmployee: data,
            });
        } else {
            console.log(err);
        }
    });
});

//Listen on Port 3000
app.listen(3000, () => {
    console.log("Listening on port 3000");
});
