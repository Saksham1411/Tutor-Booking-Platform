const Student = require("./../models/studentModel");
const Tutor = require("./../models/tutorModel");
const Session = require("./../models/sessionModel");
const Booking = require("./../models/bookingModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); //object

exports.getCheckoutSession = catchAsync(async (req, res, next) => {

  const Session = await Session.findById(req.params.sessionId);

  const startDate = req.body.startDate;
  const price = Session.price;

  const tutor =await Tutor.findById(Session.tutorId);

  //creating the checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/`, //of front-end
    cancel_url: `${req.protocol}://${req.get("host")}/maidDetails/${
      req.params.maidId
    }/`, //of front end

    customer_email: req.student.email,
    client_reference_id: req.params.sessionId,

    metadata: {
      startingDate: req.body.startingDate,
    },
    line_items: [
      {
        name: `${student.name}`,
        description: "Book session now to ease your life.",
        images: [tutor.photo],
        amount: price,
        currency: "INR",
        quantity: 1,
      },
    ],
  });
  res.status(200).json({
    status: "success",
    session,
  });
});

const createBookingCheckout = async (session) => {
  const Session = session.client_reference_id;
  const studentId = (await Student.findOne({ email: session.customer_email }))
    .id;
  const price = session.amount_total / 100;
  const startingDate = session.metadata.startingDate;
  const endingDate=new Date(Date.now() + Session.duration * 1000 * 60 * 60 * 24);
 
  await Booking.create({ studentId, sessionId:Session.id, price, startingDate, endingDate });
};
exports.webhookCheckout = async (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed")
    createBookingCheckout(event.data.object);
  res.status(200).json({ received: true });
};
