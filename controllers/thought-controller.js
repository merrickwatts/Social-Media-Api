const { Thought, User } = require("../models");

const thoughtController = {
  // get all pizzas
  getAllThought(req, res) {
    Thought.find({})
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // get one pizza by id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .populate("reactions")
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // createPizza
  createThought({ body }, res) {
    let newThought = {
      thoughtText: body.thoughtText,
      username: body.username,
      userId: body.userId,
    };

    Thought.create(newThought)
      .then((dbThoughtData) => {
        User.findOneAndUpdate(
          { _id: body.userId },
          { $addToSet: { reactions: dbThoughtData._id } },
          { new: true }
        ).then((newthoughtinfo) => res.json(newthoughtinfo));
      })
      .catch((err) => res.json(err));
  },

  // update pizza by id
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // delete pizza
  deleteThought({ params, body }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then((dbThoughtData) => {
        User.findOneAndUpdate(
          { _id: body.userId },
          { $pull: { thoughts: dbThoughtData._id } }
        ).then(() => res.json(`The thought with id: ${params.id} was deleted`));
      })
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController;
