const mysql = require('mysql')
const express = require('express')
var app = express()
const bodyparser = require('body-parser')

app.use(bodyparser.json())

var mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'passowrd',
  database: 'EmployeeDB',
  multipleStatements: true
})

mysqlConnection.connect(err => {
  if (!err) console.log('DB connection succeded')
  else console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2))
})

app.listen(3000, () => console.log('Express server is running at port:3000'))

// Get all employees
// http://localhost:3000/employees
app.get('/employees', (req, res) => {
  mysqlConnection.query('SELECT * FROM Employee', (err, rows, fields) => {
    if (!err) {
      res.send(rows)
    } else {
      console.log(err)
    }
  })
})

// Get a single employee
// http://localhost:3000/employees/1
app.get('/employees/:id', (req, res) => {
  mysqlConnection.query(
    'SELECT * FROM Employee WHERE EmpId = ?',
    [req.params.id],
    (err, rows, fields) => {
      if (!err) {
        res.send(rows)
      } else {
        console.log(err)
      }
    }
  )
})

// Delete an employee
// http://localhost:3000/employees/1
app.delete('/employees/:id', (req, res) => {
  mysqlConnection.query(
    'DELETE FROM Employee WHERE EmpId = ?',
    [req.params.id],
    (err, rows, fields) => {
      if (!err) {
        res.send('Deleted successfully.')
      } else {
        console.log(err)
      }
    }
  )
})

// Insert an employee
// http://localhost:3000/employees (post body with json)
app.post('/employees', (req, res) => {
  let emp = req.body
  var sql =
    'SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; \
  CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);'
  mysqlConnection.query(
    sql,
    [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary],
    (err, rows, fields) => {
      if (!err) {
        rows.forEach(element => {
          if (element.constructor == Array) {
            res.send('Inserted employee ID: ' + element[0].EmpID)
          }
        })
      } else {
        console.log(err)
      }
    }
  )
})

// Update an employee
// http://localhost:3000/employees (post body with json)
app.put('/employees', (req, res) => {
  let emp = req.body
  var sql =
    'SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; \
  CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);'
  mysqlConnection.query(
    sql,
    [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary],
    (err, rows, fields) => {
      if (!err) {
        res.send('Updated successfully.')
      } else {
        console.log(err)
      }
    }
  )
})
