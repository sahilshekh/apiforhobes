const express = require('express');
const { registerUser, loginUser, logoutUser, forgetPassword, resetPassword, getUserDetails,updateUserPassword, updateUserProfile, getAllUsers, getSingleUser, updateUserRole, deleteUserRole}=require('../controllers/userController');
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router=express.Router();
router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forget").post(forgetPassword)
router.route("/password/reset/:token").put(resetPassword)

router.route("/logout").get(logoutUser);


router.route("/me").get(isAuthenticatedUser,getUserDetails)
router.route("/password/update").put(isAuthenticatedUser, updateUserPassword)
router.route("/me/update").put(isAuthenticatedUser, updateUserProfile)

router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUsers)
router.route("/admin/user/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getSingleUser)
.put(isAuthenticatedUser,authorizeRoles("admin"),updateUserRole)
.delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUserRole)
module.exports=router;