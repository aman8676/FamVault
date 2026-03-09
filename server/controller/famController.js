import familyModel from "../Models/FamilyModel.js";
import userModel from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import uploadOnCloudinary from "../config/cloudinary.js";

import {v2 as cloudinary} from 'cloudinary'
import { sendInvitationEmail } from "../services/sendInvitationEmail.js";
import { sendPinUpdateToAllMembers } from "../services/sendPinUpdateEmail.js";
import { sendFamilyInfoUpdateToAllMembers } from "../services/sendFamilyInfoUpdateEmail.js";
import { FamilyForgotPin } from "../services/ForgotPin.js";
import { sendFamilyDeletedToAllMembers } from "../services/sendFamilyDeletedEmail.js";

export const createFamily = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);
    const userId = req.user._id;
    console.log(`the user who is logged in and his user id is ${userId}`);
    const { name, description, pin } = req.body;

    //  validation

    if (!name || !pin) {
      return res.status(400).json({
        success: false,
        message: "Name and PIN are required",
      });
    }

    if (pin.length < 4 || pin.length > 6) {
      return res.status(400).json({
        success: false,
        message: "PIN must be 4-6 digit",
      });
    }

    const familyId = new mongoose.Types.ObjectId();

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if (!avatarLocalPath) {
      return res.status(400).json({
        success: false,
        message: " Family Avatar is required",
      });
    }

    console.log(avatarLocalPath);

    const folderPath = `fam_vault/families/family-${familyId}/avatar`;

    const uploadedAvatar = await uploadOnCloudinary(
      avatarLocalPath,
      folderPath,
    );

    const avatarUrl = uploadedAvatar?.secure_url || uploadedAvatar?.url;

    console.log(avatarUrl);

    // check : User can create max 2 families

    const ownFamCount = await familyModel.countDocuments({
      admin: userId,
    });

    if (ownFamCount >= 2) {
      return res.status(403).json({
        success: false,
        message: "You can only create a maximum of 2 families",
      });
    }

    //Hash PIN before Saving
    const hashedPin = await bcrypt.hash(pin, 10);

    //Create family

    const family = await familyModel.create({
      _id: familyId,
      name,
      description,
      pin: hashedPin,
      avatar: avatarUrl,
      admin: userId,
      members: [], // Admin is not in members array
    });

    // Return family without Pin

    const familyData = await familyModel
      .findById(family._id)
      .populate("admin", "name email avatar")
      .select("-pin");

    res.status(201).json({
      success: true,
      message: "Family created Successfully",
      family: familyData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get all families(owned+ member of)

export const getMyFamilies = async (req, res) => {
  try {
    const userId = req.user._id;

    // we have to find the families where user is an admin  or  member

    const families = await familyModel
      .find({
        $or: [{ admin: userId }, { "members.user": userId }],
      })
      .select("name avatar admin members stats createdAt description")
      .populate("admin", "name email avatar")
      .populate("members.user", "name email avatar")
      .lean();

    if (!families || families.length === 0) {
      return res.status(200).json({
        success: true,
        message: "You are not part of any family",
        families: [],
        ownedFamilies: [],
        memberFamilies: [],
      });
    }

    const ownedFamilies = families.filter(
      (family) => family.admin._id.toString() === userId.toString(),
    );

    const memberFamilies = families.filter(
      (family) => family.admin._id.toString() !== userId.toString(),
    );

    res.status(200).json({
      success: true,
      families: families,
      ownedFamilies: ownedFamilies.map((f) => ({
        ...f,
        userRole: "owner",
      })),
      memberFamilies: memberFamilies.map((f) => ({
        ...f,
        userRole: "member",
      })),
      stats: {
        totalFamilies: families.length,
        ownedCount: ownedFamilies.length,
        memberCount: memberFamilies.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// verification of pin is done here
export const verifyFamilyPin = async (req, res) => {
  try {
    const userId = req.user._id;
    const { familyId } = req.params;
    const { pin } = req.body; // here i want family id from middleware

    if (!familyId || !pin) {
      return res.status(400).json({
        success: false,
        message: "Family ID and PIN are required",
      });
    }

    // Find family with Id

    const family = await familyModel
      .findById(familyId)
      .select("+pin")
      .populate("admin", "name email avatar")
      .populate("members.user", "name email avatar");

    if (!family) {
      return res.status(404).json({
        success: false,
        message: "Family not found",
      });
    }

    // check if a user is admin or member or not

    const isAdmin = family.admin._id.toString() === userId.toString();

    const isMember = family.members.some(
      (member) => member.user._id.toString() === userId.toString(),
    );

    if (!isAdmin && !isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this family",
      });
    }

    // verify PIN

    const isPinValid = await bcrypt.compare(pin, family.pin);

    if (!isPinValid) {
      return res.status(403).json({
        success: false,
        message: "Invalid PIN",
      });
    }

    const familyData = await familyModel
      .findById(familyId)
      .populate("admin", "name email avatar")
      .populate("members.user", "name email avatar")
      .select("-pin");

    return res.status(200).json({
      success: true,
      message: "Pin verified successfully",
      family: familyData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// invitation of member // here mail should be sent

export const inviteMember = async (req, res) => {
  try {
    const userId = req.user._id;
    const { familyId } = req.params;
    const { email, familyPin } = req.body;

    if (!email || !familyId) {
      return res.status(400).json({
        success: false,
        message: "Email and family id are required",
      });
    }

    if (!familyPin) {
      return res.status(400).json({
        success: false,
        message: "Family PIN is required to send invitation",
      });
    }

    // Email validation

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const family = await familyModel.findById(familyId).select("+pin");

    if (!family) {
      return res.status(404).json({
        success: false,
        message: "Family not found",
      });
    }

    // check permision

    const isAdmin = family.admin.toString() === userId.toString();

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "only admin can add members",
      });
    }

    // Verify the family PIN
    const isPinValid = await bcrypt.compare(familyPin, family.pin);

    if (!isPinValid) {
      return res.status(403).json({
        success: false,
        message: "Invalid family PIN",
      });
    }

    // check whether the email already invited or not

    const existingInvitation = family.invitations.find(
      (inv) => inv.email === email.toLowerCase() && inv.status === "pending",
    );

    if (existingInvitation) {
      return res.status(400).json({
        success: false,
        message: "Invitation already sent on the email",
      });
    }

    // check if user exists and already a member or not

    const invitedUser = await userModel.findOne({ email: email.toLowerCase() });

    if (invitedUser) {
      if (family.admin.toString() === invitedUser._id.toString()) {
        return res.status(400).json({
          success: false,
          message: "This user is the admin of the family",
        });
      }

      const isAlreadyMember = family.members.some(
        (member) => member.user.toString() === invitedUser._id.toString(),
      );

      if (isAlreadyMember) {
        return res.status(400).json({
          success: false,
          message: "User is already a member",
        });
      }
    }

    // check max members

    if (family.members.length >= family.settings.maxMembers) {
      return res.status(400).json({
        success: false,
        message: "Max family member limit has been reached",
      });
    }

    // Add invitation

    family.invitations.push({
      email: email.toLowerCase(),
      invitedBy: userId,
      status: "pending",
    });

    await family.save();

    //Get inviter details

    const inviter = await userModel.findById(userId).select("name email");

    console.log(`send invitation email to ${email} for family ${family.name}`);

    console.log(inviter.email,family.name,inviter.name)

    // Send the plain PIN (not hashed) to the invited user
    await sendInvitationEmail(inviter.email,family.name,email,inviter.name,familyPin)

    res.status(200).json({
      success: true,
      message: "Invitation sent successfully",
      invitations: {
        email: email.toLowerCase(),
        familyName: family.name,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//2// here is the function for user who has been invited

export const getMyInvitations = async (req, res) => {
  try {
    const userEmail = req.user.email;

    const families = await familyModel
      .find({
        "invitations.email": userEmail.toLowerCase(),
        "invitations.status": "pending",
      })
      .populate("admin", "name email avatar")
      .populate("invitations.invitedBy", "name email")
      .select("name avatar description admin invitations stats");

    const pendingInvitations = families
      .map((family) => {
        const invitation = family.invitations.find(
          (inv) =>
            inv.email === userEmail.toLowerCase() && inv.status === "pending",
        );

        if (!invitation) return null;

        return {
          _id: family._id,
          familyName: family.name,
          familyAvatar: family.avatar,
          description: family.description,
          admin: family.admin,
          invitedBy: invitation.invitedBy,
          memberCount: family.stats.totalMembers,
          invitationId: invitation._id,
        };
      })
      .filter(Boolean);

    res.status(200).json({
      success: true,
      invitations: pendingInvitations,
      count: pendingInvitations.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ACCEPT INVITATION HERE here is the user who accepts the invitation

export const acceptInvitation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { familyId } = req.params;
    const userEmail = req.user.email;

    if (!familyId) {
      return res.status(400).json({
        success: false,
        message: "familyId is required",
      });
    }

    const family = await familyModel.findById(familyId);
    if (!family) {
      return res.status(404).json({
        success: false,
        message: "Family not found",
      });
    }

    // Find Invitations

    const invitationIndex = family.invitations.findIndex(
      (inv) =>
        inv.email === userEmail.toLowerCase() && inv.status === "pending",
    );

    if (invitationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "No pending invitattion found for your email",
      });
    }

    // check if already a member of that family or not

    const isAlreadyMember = family.members.some(
      (member) => member.user.toString() === userId.toString(),
    );

    if (isAlreadyMember) {
      return res.status(400).json({
        success: false,
        message: "You are already a member of this family",
      });
    }

    // check max members

    if (family.members.length >= family.settings.maxMembers) {
      return res.status(400).json({
        success: false,
        message: "Family has reached maximum limit",
      });
    }

    const invitation = family.invitations[invitationIndex];

    //Adding as member in a  family

    console.log("members before push", family.members.length);

    family.members.push({
      user: userId,
      role: "member",
      addedBy: invitation.invitedBy,
      joinedAt: new Date(),
    });

    console.log("members after push", family.members.length);

    // updating invite status
    family.invitations[invitationIndex].status = "accepted";

    // updating size of family

    family.stats.totalMembers = family.members.length + 1;

    console.log(
      "members after push and get accepted ",
      family.stats.totalMembers,
    );

    await family.save();

    const updatedFamily = await familyModel
      .findById(familyId)
      .populate("admin", "name email avatar")
      .select("-pin");

    res.status(200).json({
      success: true,
      message: `Successfully joined ${family.name}`,
      family: updatedFamily,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const rejectInvitation = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const { familyId } = req.params;

    const family = await familyModel.findById(familyId);

    if (!family) {
      return res.status(404).json({
        success: false,
        message: "family not found",
      });
    }

    const invitationIndex = family.invitations.findIndex(
      (inv) =>
        inv.email === userEmail.toLowerCase() && inv.status === "pending",
    );

    if (invitationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "No pending invitation found ",
      });
    }

    family.invitations[invitationIndex].status = "rejected";
    await family.save();

    res.status(200).json({
      success: true,
      message: "Invitation rejected",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//Removing of member is only possible by admin only

export const removeMember = async (req, res) => {
  try {
    const userId = req.user._id;
    const { familyId, memberId } = req.params;
    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: "Member ID is required",
      });
    }

    const family = await familyModel.findById(familyId);

    if (!family) {
      return res.status(404).json({
        success: false,
        message: "Family not found",
      });
    }

    if (family.admin.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only admin can remove the member of the family",
      });
    }

    // check if member exist

    const memberExists = family.members.some(
      (member) => member.user.toString() === memberId,
    );

    if (!memberExists) {
      return res.status(404).json({
        success: false,
        message: "Member not found in this family",
      });
    }

    // removing that member now using filter method

    family.members = family.members.filter(
      (member) => member.user.toString() !== memberId,
    );

    family.stats.totalMembers = family.members.length + 1; // family.members is the length of members of the fmaily

    await family.save();

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
      totalMembers: family.stats.totalMembers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// leaving of the member of the family (only valid for members)
export const leaveFamily = async (req, res) => {
  try {
    const userId = req.user._id;
    const { familyId } = req.params;

    const family = await familyModel.findById(familyId);

    if (!family) {
      return res.status(404).json({
        success: false,
        message: "Family not found",
      });
    }

    // admin cannot leave the family because he is the only creator

    if (family.admin.toString() === userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Admin cannot leave. Delete the family instead",
      });
    }

    // check if member belongs to a family or not

    const isMember = family.members.some(
      (member) => member.user.toString() === userId.toString(),
    );

    if (!isMember) {
      return res.status(400).json({
        success: false,
        message: "You are not a  member of this family",
      });
    }

    family.members = family.members.filter(
      (member) => member.user.toString() !== userId.toString(),
    );

    family.stats.totalMembers = family.members.length + 1;

    await family.save();

    res.status(200).json({
      success: true,
      message: "Successfully left the family",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// updating the maximum size of family
export const updateFamilySettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { familyId } = req.params;
    const { maxMembers } = req.body;

    const family = await familyModel.findById(familyId);

    if (!family) {
      return res.status(400).json({
        success: false,
        message: "Family not found",
      });
    }

    if (family.admin.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only admin can update family Settings",
      });
    }

    if (maxMembers !== undefined) {
      if (maxMembers < 2 || maxMembers > 50) {
        return res.status(400).json({
          success: false,
          message: "Max members must be between 2 and 50",
        });
      }

      // Check current member count
      const currentMemberCount = family.members.length + 1; // +1 is for admin
      if (currentMemberCount > maxMembers) {
        return res.status(400).json({
          success: false,
          message: `Cannot set max members below current member count (${currentMemberCount})`,
        });
      }

      family.settings.maxMembers = maxMembers;
    }

    await family.save();

    res.status(200).json({
      success: true,
      message: "Family settings updated successfully",
      settings: family.settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update the information of family 


export const updatefamilyInfo = async(req,res)=>{
  try{
    const userId = req.user._id;
    const { familyId } = req.params;
    const { name, description } = req.body;

    if (!familyId) {
      return res.status(400).json({
        success: false,
        message: "Family ID is required",
      });
    }

    const family = await familyModel
      .findById(familyId)
      .populate("members.user", "name email")
      .populate("admin", "name email");

    if (!family) {
      return res.status(404).json({
        success: false,
        message: "Family not found",
      });
    }

    // Only admin can update family info
    if (family.admin._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only admin can update family information",
      });
    }

    // Track what changes are being made
    const changes = {};

    // Update name if provided
    if (name) {
      if (name.length < 3 || name.length > 50) {
        return res.status(400).json({
          success: false,
          message: "Family name must be between 3 and 50 characters",
        });
      }
      changes.name = name;
      family.name = name;
    }

    // Update description if provided
    if (description !== undefined) {
      if (description.length > 150) {
        return res.status(400).json({
          success: false,
          message: "Description cannot exceed 150 characters",
        });
      }
      changes.description = description;
      family.description = description;
    }

    // handle avatar update

    if(req.files?.avatar){
      const avatarLocalPath = req.files.avatar[0].path;

      //delete old avatar from cloudinary first

      if(family.avatar){
        try{
          const oldAvatarUrl = family.avatar;
          const urlParts = oldAvatarUrl.split('/');

          const uploadIndex = urlParts.indexOf('upload');

          if(uploadIndex !==-1) {

            const publicIdWithExtension = urlParts.slice(uploadIndex+1).join('/')
            const publicId = publicIdWithExtension.substring(0,publicIdWithExtension.lastIndexOf('.'))

            await cloudinary.uploader.destroy(publicId);

            console.log(`Old avatar deleted: ${publicId}`);
          }
        } catch(deleteError){
          console.error("Error deletion of old avatar",deleteError);
        }
      }
      const folderPath = `fam_vault/families/family-${familyId}/avatar`

      const uploadedAvatar = await uploadOnCloudinary(
        avatarLocalPath,
        folderPath
      );

      if(uploadedAvatar){
        family.avatar = uploadedAvatar.secure_url || uploadedAvatar.url;
        changes.avatar = true;
      }
      else{
        return res.status(500).json({
          success: false,
          message:"Failed to upload new Avatar",
        })
      }
    }

    await family.save();

    // Send update email to all members (excluding admin) if there are changes
    const hasChanges = Object.keys(changes).length > 0;
    
    if (hasChanges) {
      const membersToNotify = family.members.filter(
        (member) => member.user._id.toString() !== userId.toString()
      );

      if (membersToNotify.length > 0) {
        // Send emails asynchronously (don't wait for completion to respond)
        sendFamilyInfoUpdateToAllMembers(
          membersToNotify,
          family.name,
          family.admin.name,
          changes
        ).then((result) => {
          console.log(`Family info update notification results:`, result);
        }).catch((err) => {
          console.error("Error sending family info update emails:", err);
        });
      }
    }

    const updatedFamily = await familyModel
      .findById(familyId)
      .populate("admin", "name email avatar")
      .select("-pin");

    res.status(200).json({
      success: true,
      message: "Family information updated successfully",
      family: updatedFamily,
      membersNotified: hasChanges ? family.members.filter(m => m.user._id.toString() !== userId.toString()).length : 0,
    });
  } catch(error)
  {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// update familyPin

export const updateFamilyPin = async(req,res)=>{
  try{
    const userId = req.user._id;
    const{familyId}= req.params;
    const {oldPin,newPin}= req.body;

    if(!familyId){
      return res.status(400).json({
        success: false,
        message:"Family Id is required ",
      })
    }

    if(!oldPin || !newPin){
      return res.status(400).json({
        success: false,
        message:"Old PIN and new PIN are required"
      })
    }

    // validate new Pin format

    if(newPin.length<4 || newPin.length>6)
    {
      return res.status(400).json({
        success: false,
        message:"New PIN must be 4-6 digits"
      })
    }

    // finding family with their id and also extracting pin, populating members for email
    const family = await familyModel
      .findById(familyId)
      .select("+pin")
      .populate("members.user", "name email")
      .populate("admin", "name email");

    if(!family){
      return res.status(404).json({
        success : false,
        message: "Family not found",
      });
    }

    // only admins can update pin na 

    if (family.admin._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only admin can update family PIN",
      });
    }

    // verify old pin 

    const isOldPinValid = await bcrypt.compare(oldPin, family.pin);

    if(!isOldPinValid){
      return res.status(403).json({
        success: false,
        message:"Old pin is incorrect"
      })
    }

    // hash and update new pin

    const hashedNewPin = await bcrypt.hash(newPin,10);
    family.pin = hashedNewPin;

    await family.save();

    // Sending PIN update email to all members (excluding admin)
    const membersToNotify = family.members.filter(
      (member) => member.user._id.toString() !== userId.toString()
    );

    if (membersToNotify.length > 0) {
      // Sending emails asynchronously
      sendPinUpdateToAllMembers(
        membersToNotify,
        family.name,
        family.admin.name,
        newPin
      ).then((result) => {
        console.log(`PIN update notification results:`, result);
      }).catch((err) => {
        console.error("Error sending PIN update emails:", err);
      });
    }

    res.status(200).json({
      success: true,
      message:"Family PIN updated Successfully",
      membersNotified: membersToNotify.length,
    });
  } catch(error) {
    res.status(500).json({
      success: false,
      message:error.message,
    });
  }
};

// reset Pin in case admin forgets pin 

export const resetFamilyPin = async (req, res) => {
  try {
    const userId = req.user._id;
    const { familyId } = req.params;
    const { newPin } = req.body;

    // ── Validations ──
    if (!familyId) {
      return res.status(400).json({
        success: false,
        message: "Family ID is required",
      });
    }

    if (!newPin) {
      return res.status(400).json({
        success: false,
        message: "New PIN is required",
      });
    }

    if (newPin.length < 4 || newPin.length > 6) {
      return res.status(400).json({
        success: false,
        message: "PIN must be 4-6 digits",
      });
    }

    // ── Find family with members and admin ──
    const family = await familyModel
      .findById(familyId)
      .select("+pin")
      .populate("members.user", "name email")
      .populate("admin", "name email");

    if (!family) {
      return res.status(404).json({
        success: false,
        message: "Family not found",
      });
    }

    // ── Only admin can reset PIN ──
    if (family.admin._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only admin can reset family PIN",
      });
    }

    // ── Hash and save new PIN ──
    family.pin = await bcrypt.hash(newPin, 10);
    await family.save();

    // ── Prepare email data ──
    const resetDate = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    const loginUrl = process.env.CLIENT_URL || "https://yourapp.com/login";

    // ── Send email to ALL members via your FamilyForgotPin service ──
    const allMembers = family.members.map((m) => m.user);

    if (allMembers.length > 0) {
      Promise.allSettled(
        allMembers.map((member) =>
          FamilyForgotPin(
            family.name, // familyName
            family.admin.name, // adminName
            resetDate, // resetDate
            newPin, // pin (plain text for email)
            loginUrl, // loginUrl
            member.email, // memberEmail
          ),
        ),
      )
        .then((results) => {
          const failed = results.filter((r) => r.status === "rejected");
          if (failed.length > 0) {
            console.error(`${failed.length} email(s) failed to send`, failed);
          } else {
            console.log(
              `PIN reset emails sent to ${allMembers.length} member(s)`,
            );
          }
        })
        .catch((err) => console.error("Unexpected email error:", err));
    }

    return res.status(200).json({
      success: true,
      message: "Family PIN reset successfully",
      membersNotified: allMembers.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete family (admin only can delete)

export const deleteFamily = async(req,res)=>{
  try{
    const userId = req.user._id;
    const {familyId} = req.params;

    if(!familyId){
      return res.status(400).json({
        success: false,
        message: "family Id is required"
      });
    }

    const family = await familyModel
      .findById(familyId)
      .populate("members.user", "name email")
      .populate("admin", "name email");

    if(!family){
      return res.status(404).json({
        success: false,
        message: "Family not found",
      });
    }

    if(family.admin._id.toString()!==userId.toString()) {
      return res.status(403).json({
        success: false,
        message:"Only admin can delete the family",
      });
    }

    // Store family info before deletion for email
    const familyName = family.name;
    const adminName = family.admin.name;
    
    // Get members to notify (excluding admin)
    const membersToNotify = family.members.filter(
      (member) => member.user._id.toString() !== userId.toString()
    );

    try {
      const folderPath = `fam_vault/families/family-${familyId}`;

      // Step 1: Delete all resource types
      await Promise.all([
        cloudinary.api.delete_resources_by_prefix(folderPath, {
          resource_type: "image",
        }),
        cloudinary.api.delete_resources_by_prefix(folderPath, {
          resource_type: "video",
        }),
        cloudinary.api.delete_resources_by_prefix(folderPath, {
          resource_type: "raw",
        }),
      ]);

      await cloudinary.api.delete_folder(folderPath);

      console.log(`Family folder deleted: ${folderPath}`);
    } catch (folderError) {
      console.error("Cloudinary deletion error:", folderError);
    }

    await familyModel.findByIdAndDelete(familyId);

    // Send deletion email to all members (after deletion so we don't block)
    if (membersToNotify.length > 0) {
      sendFamilyDeletedToAllMembers(
        membersToNotify,
        familyName,
        adminName
      ).then((result) => {
        console.log(`Family deletion notification results:`, result);
      }).catch((err) => {
        console.error("Error sending family deletion emails:", err);
      });
    }

    res.status(200).json({
      success: true,
      message: `${familyName} has been deleted successfully`,
      membersNotified: membersToNotify.length,
    });
  } catch(error){

    res.status(500).json({
      success:false,
      message: error.message,
    });
  }
};

