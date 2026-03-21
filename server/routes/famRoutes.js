import express from 'express'
import { upload } from '../middlewares/multer.middleware.js'

import { acceptInvitation, createFamily, deleteFamily, getMyFamilies, getMyInvitations, inviteMember, leaveFamily, rejectInvitation, removeMember, updatefamilyInfo, updateFamilyPin, updateFamilySettings, verifyFamilyPin,resetFamilyPin } from '../controller/famController.js'
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { invitationRateLimiter } from '../middlewares/rateLimiter.middleware.js';

const familyRouter = express.Router();

familyRouter.post(
  "/create-family",
  verifyJWT,
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  createFamily
);

familyRouter.get("/my-families",verifyJWT,getMyFamilies)

familyRouter.post("/verify-pin/:familyId",verifyJWT,verifyFamilyPin)

familyRouter.post("/send-invitation/:familyId", verifyJWT, invitationRateLimiter(10, 60 * 60 * 1000), inviteMember)


familyRouter.get("/my-invitation", verifyJWT, getMyInvitations);

familyRouter.post("/accept-invitation/:familyId", verifyJWT,acceptInvitation);

familyRouter.post("/reject-invitation/:familyId",verifyJWT,rejectInvitation);

familyRouter.post("/remove-member/:familyId/:memberId",verifyJWT,removeMember);

familyRouter.post("/leave-family/:familyId", verifyJWT, leaveFamily);

familyRouter.patch("/settings/:familyId",verifyJWT,updateFamilySettings);

familyRouter.patch(
  "/info/:familyId",
  verifyJWT,
  upload.fields([{name:"avatar",maxCount:1}]),
  updatefamilyInfo
);



familyRouter.patch("/pin/:familyId", verifyJWT, updateFamilyPin);

familyRouter.put("/families/:familyId/reset-pin", verifyJWT, resetFamilyPin);


familyRouter.delete(
  "/delete/:familyId",verifyJWT,deleteFamily
)

export default familyRouter;