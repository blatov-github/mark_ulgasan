const app = require('express')();
const Routes = require('./routes/routes');
const AdminRoutes = require('./routes/admin-routes');
const ContactRoutes = require('./routes/contact-routes');
const ForgotRoutes = require('./routes/forgot-routes');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http').Server(app);
const io = require('socket.io')(http);
socketservice = require('./services/socket')(io);

// Import server config
const { server } = require('./config/config');
// Support json
app.use(bodyParser.json());
// Support : form/urlencoded
app.use(bodyParser.urlencoded());
// Enable cross-origin for all domain
app.use(cors({ origin: '*' }));

app.use(function(req, res, next) {
    console.log("=============================Request==========================");
    console.log(req.originalUrl);
    console.log(req.body);
    console.log("=============================Request==========================");
    req.socketservice = socketservice;
    next();
});
// Load Router
app.use(Routes);
app.use('/admin', AdminRoutes);
app.use('/contact', ContactRoutes);
app.use('/forgot', ForgotRoutes);
// Start app
http.listen(server.port, console.log('server start successfully on ' + server.port));