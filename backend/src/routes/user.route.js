import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  acceptFriendRequest,
  getFriendRequest,
  getMyFriends,
  getOutgoingFriendReqs,
  getRecommendedUsers,
  rejectFriendRequest,
  sendFriendRequest,
  removeFriend,
} from "../controllers/user.controller.js";

const router = express.Router();

// apply auth middleware to all routes
router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);
router.put("/friend-request/:id/reject", rejectFriendRequest);
router.delete("/remove-friend/:id", removeFriend);

router.get("/friend-requests", getFriendRequest);
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);

export default router;
