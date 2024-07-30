const { connectToDatabase } = require("../../config/database");
const { ApiResponse } = require("../../config/ApiResponse");
const { ObjectId } = require("mongodb");
const moment = require("moment/moment");

const recomendLatihan = (dataWorkout, weight) => {
  // Langkah 1: Normalisasi matriks
  const normalizeMatrix = (data) => {
    const criteriaCount = data[0].weight_criteria.length;
    const normalized = Array.from({ length: data.length }, () =>
      Array(criteriaCount).fill(0)
    );

    for (let j = 0; j < criteriaCount; j++) {
      const sum = Math.sqrt(
        data.reduce((acc, item) => acc + item.weight_criteria[j] ** 2, 0)
      );
      data.forEach((item, i) => {
        normalized[i][j] = item.weight_criteria[j] / sum;
      });
    }

    return normalized;
  };

  // Langkah 2: Hitung matriks terbobot
  const weightedMatrix = (normalized, weights) => {
    return normalized.map((row) => row.map((value, i) => value * weights[i]));
  };

  // Langkah 3: Tentukan solusi ideal positif dan negatif
  const idealSolutions = (matrix) => {
    const criteriaCount = matrix[0].length;
    const idealPositive = Array(criteriaCount).fill(0);
    const idealNegative = Array(criteriaCount).fill(Infinity);

    matrix.forEach((row) => {
      row.forEach((value, i) => {
        if (value > idealPositive[i]) idealPositive[i] = value;
        if (value < idealNegative[i]) idealNegative[i] = value;
      });
    });

    return { idealPositive, idealNegative };
  };

  // Langkah 4: Hitung jarak ke solusi ideal positif dan negatif
  const distanceToIdeals = (matrix, idealPositive, idealNegative) => {
    return matrix.map((row) => {
      const dPositive = Math.sqrt(
        row.reduce((acc, value, i) => acc + (value - idealPositive[i]) ** 2, 0)
      );
      const dNegative = Math.sqrt(
        row.reduce((acc, value, i) => acc + (value - idealNegative[i]) ** 2, 0)
      );
      return { dPositive, dNegative };
    });
  };

  // Langkah 5: Hitung skor preferensi
  const preferenceScores = (distances) => {
    return distances.map(
      ({ dPositive, dNegative }) => dNegative / (dPositive + dNegative)
    );
  };

  // Implementasi keseluruhan TOPSIS
  const normalized = normalizeMatrix(dataWorkout);
  const weighted = weightedMatrix(normalized, weight);
  const { idealPositive, idealNegative } = idealSolutions(weighted);
  const distances = distanceToIdeals(weighted, idealPositive, idealNegative);
  const scores = preferenceScores(distances);

  // Menambahkan skor ke data latihan asli dan mengurutkan berdasarkan skor
  const recommendations = dataWorkout
    .map((dataWorkout, i) => ({
      ...dataWorkout,
      score: scores[i],
    }))
    .filter((workout) => workout.score >= 0.4) // Menghilangkan latihan dengan skor < 0.4
    .sort((a, b) => b.score - a.score);

  return recommendations;
};


module.exports = {
  recomendedGetLatihan: async (req, res) => {
    const dataKriteria = [
      parseFloat(req.body.bmi),
      parseFloat(req.body.intensitas),
      parseFloat(req.body.endurance),
    ];
 console.log(dataKriteria)
    try {
      const db = await connectToDatabase();
      const collection = db.collection("workouts");
      const LatihanExc = await collection
        .find({ muscleGroup: "perut", difficulty: req.params._diff })
        .toArray();
        console.log(LatihanExc)
      const result = recomendLatihan(LatihanExc, dataKriteria);
      // await collection2.insertOne(data);
      return res
        .status(200)
        .send(
          ApiResponse(
            "Success get recomend workout excercise ",
            true,
            200,
            result
          )
        );
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  norecomendedGetLatihan: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection("workouts");
      const result = await collection
        .find({ muscleGroup: req.params._type, difficulty: req.params._diff })
        .toArray();

      return res
        .status(200)
        .send(
          ApiResponse(
            "Success get not recomend workout excercise ",
            true,
            200,
            result
          )
        );
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  postActivity: async (req, res) => {
    const data = {
      _uid: new ObjectId(req.body._uid),
      date_activity: moment().format("DDMMYYYY"),
      muscleGroup: req.body.muscleGroup,
      point_activity: parseInt(req.body.totals_excercise),
      totals_excercise: parseInt(req.body.totals_excercise),
      weight_body_current: parseInt(req.body.weight_body_current),
    };
    try {
      const db = await connectToDatabase();
      const collection = db.collection("user_activity");
      const result = await collection.insertOne(data);
      return res
        .status(200)
        .send(ApiResponse("Success send data", true, 200, result));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  getCurrentLatihan: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection("user_activity");
      const result = await collection
        .find({ _uid: new ObjectId(req.user._id) })
        .toArray();

      return res
        .status(200)
        .send(ApiResponse("Success get activity  current ", true, 200, result));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
};
