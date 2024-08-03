const { connectToDatabase } = require("../../config/database");
const { ApiResponse } = require("../../config/ApiResponse");
const { ObjectId } = require("mongodb");
const moment = require("moment/moment");

module.exports = {
  DashboardUser: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection1 = db.collection("user_activity");
      const activity = await collection1
        .find({ _uid: new ObjectId(req.user._id) })
        .toArray();

      return res
        .status(200)
        .send(
          ApiResponse("Berhasil", true, 200, activity,
          )
        );
    } catch (error) {
      return res.status(500).send(ApiResponse( "Ada problem nih " + error , false, 500, result));
    }
  },
};
