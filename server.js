require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3001

var corsOptions = {
    origin: "*"
};  

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to application." }); 
});

require('./app/utils/stockAlert.js');
require("./app/routes/auth.routes.js")(app);
require("./app/routes/branch.routes.js")(app);
require("./app/routes/role.routes.js")(app);
require("./app/routes/prd_category.routes.js")(app);
require("./app/routes/product.routes.js")(app);
require('./app/routes/vendor.routes.js')(app);
require('./app/routes/issue.routes.js')(app);
require('./app/routes/order.routes.js')(app);
require('./app/routes/order_line_item.routes.js')(app);
require('./app/routes/permission.routes.js')(app);
require('./app/routes/module.routes.js')(app);
require('./app/routes/return.routes.js')(app);
require('./app/routes/employee.router.js')(app);
require('./app/routes/reports.router.js')(app);
require('./app/routes/assets.router.js')(app);
require('./app/routes/assets_type.router.js')(app);
require('./app/routes/location.router.js')(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});