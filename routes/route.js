const { CheckInputRegexOnEmpty } = require("../config/Checker");
const { HandleUploadContent } = require("../config/UploadConfig");
const {
  getDataLatihan,
  postDataLatihan,
  deleteDataLatihan,
  putDataLatihan,
} = require("../controllers/Admin/KelolaLatihan");
const { VerifyToken } = require("../controllers/Auth");
const { Dashboard, DashboardUser } = require("../controllers/User/Dashboard");
const { LeaderBoardUsers } = require("../controllers/User/LeaderboardUsers");
const { Profile } = require("../controllers/User/Profile");
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
router.get("/api/v1/user", DashboardUser);
router.post(
  "/api/v1/user/latihan/recomended/:_diff/:_type",
  recomendedGetLatihan
);
router.post("/api/v1/user/latihan/:_diff/:_type", norecomendedGetLatihan);
router.post("/api/v1/user/latihan/activity", VerifyToken,postActivity);
router.get("/api/v1/user/latihan/activitycurrent", VerifyToken,getCurrentLatihan);

// ===================================== ADMIN =============================================================
router.get("/api/v1/admin", getDataLatihan);
router.get("/api/v1/admin/user/activity", getDataLatihan);
router.get("/api/v1/admin/profile", Profile);
router.get("/api/v1/admin/latihan", getDataLatihan);
router.post("/api/v1/admin/latihan", CheckInputRegexOnEmpty, postDataLatihan);
router.put("/api/v1/admin/latihan/:_id", HandleUploadContent, putDataLatihan);
router.delete("/api/v1/admin/latihan/:_id", deleteDataLatihan);

module.exports = router;
