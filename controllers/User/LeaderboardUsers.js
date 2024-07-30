const { connectToDatabase } = require("../../config/database");
const { ApiResponse } = require("../../config/ApiResponse");

module.exports = {
  LeaderBoardUsers: async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
      const db = await connectToDatabase();
      const collection = db.collection("user_activity");
      const result = await collection.aggregate([
        {
          $group: {
            _id: "$_uid",
            total_points: { $sum: "$point_activity" }
          }
        },
        {
          $sort: { total_points: -1 }
        },
        {
          $limit: 10
        }
      ]).toArray();;
      return res.status(200).send(ApiResponse("Success", true, 200, result));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  
};
