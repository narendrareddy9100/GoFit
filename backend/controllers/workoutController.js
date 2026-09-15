const Workout = require('../models/Workout');

exports.create = async (req, res) => {
  try {
    const w = await Workout.create({
      ...req.body,
      userId: req.userId
    });

    res.status(201).json(w);
  } catch (e) {
    res.status(400).json({
      message: 'Could not add workout',
      error: e.message
    });
  }
};

exports.list = async (req, res) => {
  try {
    res.json(
      await Workout.find({ userId: req.userId })
        .sort({ date: -1 })
    );
  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const r = await Workout.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!r) {
      return res.status(404).json({
        message: 'Workout not found'
      });
    }

    res.json({
      message: 'Workout deleted'
    });
  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
};


// =========================
// WORKOUT STREAK
// =========================

exports.streak = async (req, res) => {
  try {
    const workouts = await Workout.find({
      userId: req.userId
    }).sort({ date: -1 });

    if (workouts.length === 0) {
      return res.json({
        currentStreak: 0,
        bestStreak: 0
      });
    }

    // Get unique workout dates
    const dates = [
      ...new Set(
        workouts.map((workout) => {
          const d = new Date(workout.date);

          return new Date(
            d.getFullYear(),
            d.getMonth(),
            d.getDate()
          ).getTime();
        })
      )
    ].sort((a, b) => b - a);

    // Calculate best streak
    let bestStreak = 1;
    let streak = 1;

    for (let i = 1; i < dates.length; i++) {
      const difference =
        (dates[i - 1] - dates[i]) /
        (1000 * 60 * 60 * 24);

      if (difference === 1) {
        streak++;
        bestStreak = Math.max(bestStreak, streak);
      } else {
        streak = 1;
      }
    }

    // Calculate current streak
    const today = new Date();

    const todayTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime();

    const yesterdayTime =
      todayTime - (1000 * 60 * 60 * 24);

    let currentStreak = 0;

    if (
      dates[0] === todayTime ||
      dates[0] === yesterdayTime
    ) {
      currentStreak = 1;

      for (let i = 1; i < dates.length; i++) {
        const difference =
          (dates[i - 1] - dates[i]) /
          (1000 * 60 * 60 * 24);

        if (difference === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    res.json({
      currentStreak,
      bestStreak
    });

  } catch (e) {
    res.status(500).json({
      message: 'Could not calculate streak',
      error: e.message
    });
  }
};