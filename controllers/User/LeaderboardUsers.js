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
          $lookup: {
            from: 'users',
            localField: '_uid',
            foreignField: '_id',
            as: 'user_info'
          }
        },
        {
          $unwind: '$user_info'
        },
        {
          $group: {
            _id: '$user_info._id',
            username: { $first: '$user_info.username' },
            profilPath: { $first: '$user_info.profilPath' },
            total_points: { $sum: '$point_activity' }
          }
        },
        {
          $sort: { total_points: -1 }
        },
        {
          $limit: 100
        }
      ]).toArray();
      return res.status(200).send(ApiResponse("Berhasil", true, 200, result));
    } catch (error) {
      return res.status(500).send(ApiResponse( "Ada problem nih " + error , false, 500, result));
    }
  },
  
};
