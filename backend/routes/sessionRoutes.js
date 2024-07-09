const express = require("express");
const sessionRouter = express.Router({ mergeParams: true });
const sessionController = require("./../controllers/sessionController");
const tutorAuthController = require("../controllers/tutorAuthController");


sessionRouter.get("/",sessionController.getAllSessions);

sessionRouter.use(tutorAuthController.protect);

sessionRouter.post("/createSession/",sessionController.createSession);
sessionRouter
  .route("/:sessionId")
  .get(sessionController.getSession)
  .patch(sessionController.updateSession)
  .delete(sessionController.deleteSession);

module.exports = sessionRouter;
