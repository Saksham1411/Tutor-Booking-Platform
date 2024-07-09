const express = require("express");
const sessionRouter = express.Router({ mergeParams: true });
const sessionController = require("./../controllers/sessionController");

sessionRouter.get("/",sessionController.getAllSessions);

sessionRouter.post("/createSession/",sessionController.createSession);
sessionRouter
  .route("/:sessionId")
  .get(sessionController.getSession)
  .patch(sessionController.updateSession)
  .delete(sessionController.deleteSession);

module.exports = sessionRouter;
