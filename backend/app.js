const express = require("express");
const app = express();

const studentRouter = require("./routes/studentRoutes");
const studentAuthRouter = require("./routes/studentAuthRoutes");
const tutorAuthRouter = require("./routes/tutorAuthRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const sessionRouter = require("./routes/sessionRoutes");
const tutorRouter = require("./routes/tutorRoutes");
const bookingController=require("./controllers/bookingController");
const bookingRouter=require("./routes/bookingRoutes");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

////security measures
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const compression = require("compression");

const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP. Please try after one hour",
});
app.use(compression());
const path = require("path");
__dirname = path.resolve();

app.use("/api/v1", limiter);

//to get data of requests body and limiting it to maximum 10kb
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(cors({ origin: "*" }));
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      scriptSrc: ["'self'", "https://js.stripe.com"],
      frameSrc: ["self", "https://js.stripe.com", "https://hooks.stripe.com"],
    },
  })
);

app.use(helmet.crossOriginOpenerPolicy());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(helmet.hidePoweredBy());

app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.json({ limit: "10kb" }));

// checkout route
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  bookingController.webhookCheckout
);

////Routes middlewares
 app.use("/api/v1/studentsAuth", studentAuthRouter);
 app.use("/api/v1/tutorsAuth", tutorAuthRouter);
 app.use("/api/v1/students", studentRouter);
 app.use("/api/v1/tutors", tutorRouter);
 app.use("/api/v1/reviews", reviewRouter);
 app.use("/api/v1/sessions", sessionRouter);
 app.use("/api/v1/bookings", bookingRouter);



//global errors handler
app.use(globalErrorHandler);

module.exports = app;
