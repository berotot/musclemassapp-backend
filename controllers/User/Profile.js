const { connectToDatabase } = require("../../config/database");
const { ApiResponse } = require("../../config/ApiResponse");
const { ObjectId } = require("mongodb");

module.exports = {
  Profile: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection("users");
      const result = await collection.aggregate([
        {
          $match: { _id: new ObjectId(req.user._id) }
        },
        {
          $lookup: {
            from: 'user_activity', 
            localField: '_id',
            foreignField: '_uid',
            as: 'activities'
          }
        },
        {
          $addFields: {
            totalPoints: { $sum: '$activities.point_activity' }
          }
        },
        {
          $project: {
            _id: 1,
            username: 1,
            email: 1,
            totalPoints: 1,
           
          }
        }
      ]).toArray();

      return res.status(200).send(ApiResponse("Berhasil", true, 200, result));
    } catch (error) {
      return res.status(500).send(ApiResponse( "Ada problem nih " + error , false, 500, []));
    }
  },
};
