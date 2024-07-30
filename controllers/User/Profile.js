const { connectToDatabase } = require("../../config/database");
const { ApiResponse } = require("../../config/ApiResponse");
const { ObjectId } = require("mongodb");

module.exports = {
  Profile: async (req, res) => {
    
    try {
      const db = await connectToDatabase();
      const collection = db.collection("users");
      const result = await collection.findOne({
        _id: new ObjectId(req.user._id),
      });

      return res.status(200).send(ApiResponse("Success get data profile", true, 200, result));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
};
