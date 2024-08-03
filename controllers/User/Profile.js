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
  EditProfile: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection("users");
      const updateFields = {};
  
      if (req.body.username) {
        const name = await collection.findOne({
          username: req.body.username,
          _id: { $not: { $eq: new ObjectId(req.user._id) } },
        });
        if (name) {
          return res.status(400).send(ApiResponse(`Username sudah digunakan`, false, 400, []));
        }
        updateFields.username = req.body.username;
      }
  
      if (req.body.email) {
        const email = await collection.findOne({
          email: req.body.email,
          _id: { $not: { $eq: new ObjectId(req.user._id) } },
        });
        if (email) {
          return res.status(400).send(ApiResponse(`Email sudah digunakan`, false, 400, []));
        }
        updateFields.email = req.body.email;
      }
  
      if (req.body.password) {
        updateFields.password = req.body.password;
      }
  
      if (Object.keys(updateFields).length === 0) {
        return res.status(400).send(ApiResponse(`Tidak ada data yang diperbarui`, false, 400, []));
      }
  
    const result = await collection.updateOne(
        { _id: new ObjectId(req.user._id) },
        { $set: updateFields }
      );
  
      if (result.modifiedCount === 0) {
        return res.status(400).send(ApiResponse("Tidak ada data yang diperbarui", false, 400, []));
      }
  
      return res.status(200).send(ApiResponse("Berhasil mengubah data", true, 200, updateFields));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  }
  
};
