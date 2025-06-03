const express = require('express');
const Employee = require('../models/employee.model.js');

module.exports = function(app) {
    const router = express.Router();

  
    router.get('/', async (req, res) => {
        try {
            const employees = await Employee.getAllEmployees();
            res.status(200).json(employees);
        } catch (error) {
            res.status(500).json({ errors: "Error fetching employees" });
        }
    });

    
    router.get('/:id', async (req, res) => {
        try {
            const employee = await Employee.getEmployeeById(req.params.id);
            if (employee.length > 0) {
                res.status(200).json(employee[0]);
            } else {
                res.status(404).json({ errors: "Employee not found" });
            }
        } catch (error) {
            res.status(500).json({ errors: "Error fetching employee" });
        }
    });


    router.post('/', async (req, res) => {
       
        try {
            const result = await Employee.addEmployee(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ errors: "Error adding employee" });
        }
    });

    router.put('/update/:id', async (req, res) => {
        try {
            const result = await Employee.updateEmployee(req.params.id, req.body);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ errors: "Error updating employee" });
        }
    });

    router.delete('/delete/:id', async (req, res) => {
        try {
            const result = await Employee.deleteEmployee(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ errors: "Error deleting employee" });
        }
    });

    app.use('/employee', router);
};
