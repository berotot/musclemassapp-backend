const { connectToDatabase } = require("../../config/database");
const { ApiResponse } = require("../../config/ApiResponse");
const { ObjectId } = require("mongodb");


module.exports = {
  getDataUserActivity: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection("users");
      const result = await collection.find().toArray();

      return res
        .status(200)
        .send(ApiResponse("Berhasil", true, 200, result));
    } catch (error) {
      return res.status(500).send(ApiResponse( "Ada problem nih " + error , false, 500, result));
    }
  },
  postDataLatihan: async (req, res) => {
    const data = {
      name: req.body.name,
      description: req.body.description,
      muscleGroup: req.body.muscleGroup,
      reps: parseInt(req.body.reps),
      weight_criteria: [parseFloat(req.body.c1), parseFloat(req.body.c2), parseFloat(req.body.c3), parseFloat(req.body.c4)],
      time_training: req.body.time_training,
      difficulty: req.body.difficulty,
      contentUrl: "null" ,
      // contentUrl: req.files.contentPath[0].filename,
    };
    
    try {
      const db = await connectToDatabase();
      const collection = db.collection("workouts");
      const result = await collection.insertOne(data);

      return res
        .status(200)
        .send(ApiResponse("Berhasil", true, 200, result));
    } catch (error) {
      return res.status(500).send(ApiResponse( "Ada problem nih " + error , false, 500, result));
    }
  },
  putDataLatihan: async (req, res) => {
    const data = {
      name: req.body.name,
      description: req.body.description,
      muscleGroup: req.body.muscleGroup,
      reps: req.body.reps,
      weight_criteria: [req.body.c1, req.body.c2, req.body.c3, req.body.c4],
      time_training: req.body.time_training,
      difficulty: req.body.difficulty,
      contentUrl: req.files.contentPath[0].filename,
    };
    try {
      const db = await connectToDatabase();
      const collection = db.collection("workouts");
      const result = await collection.updateOne(
        { _id: ObjectId(req.body._id) },
        { $set: data }
      );

      return res
        .status(200)
        .send(ApiResponse("Berhasil", true, 200, result));
    } catch (error) {
      return res.status(500).send(ApiResponse( "Ada problem nih " + error , false, 500, []));
    }
  },
  deleteDataLatihan: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection("workouts");
      const result = await collection.findOne({
        _id: new ObjectId(req.params._id),
      });
      if (!result) {
        return res
          .status(200)
          .send(ApiResponse("Data tidak di ketahui", true, 200, []));
      }

      // if (result.contentUrl) {
      //   fs.unlinkSync("./etc/uploads/" + result.contentUrl);
      // }
      await collection.deleteOne({ _id: new ObjectId(req.params._id) });
      return res
        .status(200)
        .send(ApiResponse("Berhasil menghapus data", true, 200, []));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
};
