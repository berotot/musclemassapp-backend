const { CheckInputRegexOnEmpty } = require("../config/Checker");
const { HandleUploadContent } = require("../config/UploadConfig");
const {
  getDataLatihan,
  postDataLatihan,
  deleteDataLatihan,
  putDataLatihan,
} = require("../controllers/Admin/KelolaLatihan");
const { VerifyToken, ValidRoleAdmin } = require("../controllers/Auth");
const { Dashboard, DashboardUser } = require("../controllers/User/Dashboard");
const { LeaderBoardUsers } = require("../controllers/User/LeaderboardUsers");
const { Profile, EditProfile } = require("../controllers/User/Profile");
const {
  getLatihan,
  postActivity,
  getCurrentLatihan,
  recomendedGetLatihan,
  norecomendedGetLatihan,
} = require("../controllers/User/UserLatihan");

const router = require("express").Router();

// ========================================== VISITOR ======================================================
router.get("/api/v1/user/leaderboard", VerifyToken,LeaderBoardUsers);
router.get("/api/v1/user/profile",VerifyToken, Profile);
router.put("/api/v1/user/profile",VerifyToken, EditProfile);
router.get("/api/v1/user", VerifyToken,DashboardUser);
router.post(
  "/api/v1/user/latihan/recomended/:_diff/:_type",VerifyToken,
  recomendedGetLatihan
);
router.post("/api/v1/user/latihan/:_diff/:_type", VerifyToken,norecomendedGetLatihan);
router.post("/api/v1/user/latihan/activity", VerifyToken,postActivity);
router.get("/api/v1/user/latihan/activitycurrent", VerifyToken,getCurrentLatihan);

// ===================================== ADMIN =============================================================
router.get("/api/v1/admin", getDataLatihan);
router.get("/api/v1/admin/user/activity", getDataLatihan);
router.get("/api/v1/admin/profile", Profile);
router.get("/api/v1/admin/latihan",VerifyToken,ValidRoleAdmin, getDataLatihan);
router.post("/api/v1/admin/latihan", CheckInputRegexOnEmpty, postDataLatihan);
router.put("/api/v1/admin/latihan/:_id", HandleUploadContent, putDataLatihan);
router.delete("/api/v1/admin/latihan/:_id",VerifyToken,ValidRoleAdmin, deleteDataLatihan);

module.exports = router;
