const { Thought, Reaction } = require("../models");

const reactionController = {
  addReaction({ params, body }, res) {
    let newReaction = {
      reactionBody: body.reactionBody,
      username: body.username,
      userId: body.userId,
    };

    Reaction.create(newReaction)
      .then((dbReactionData) => {
        Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $addToSet: { reactions: dbReactionData._id } },
          { new: true }
        ).then((dbReactionData) => res.json(dbReactionData));
      })
      .catch((err) => res.json(err));
  },

  deleteReaction({ params, body }, res) {
    Reaction.findOneAndDelete({ _id: params.reactionId })
      .then((dbReactionData) => {
        Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $pull: { reactions: dbReactionData._id } },
          { new: true }
        ).then(() =>
          res.json(`The reaction with id: ${params.reactionId} was deleted`)
        );
      })
      .catch((err) => res.json(err));
  },
};

module.exports = reactionController;
