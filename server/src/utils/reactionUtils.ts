// @ts-ignore

export const findReactionByType = (reactions, reactionType) => {
  // @ts-ignore

  return reactions.find((reaction) => reaction.type === reactionType);
};

// @ts-ignore

export const addReaction = (recipe, user, reactionType) => {
  // @ts-ignore
  const reaction = recipe.reactions.find((r) => r.type === reactionType);
  if (reaction) {
    // @ts-ignore

    if (!reaction.users.some((u) => u.userId.equals(user._id))) {
      reaction.count++;
      reaction.users.push({
        userId: user._id,
        userDisplayName: user.displayName,
      });
    }
  } else {
    recipe.reactions.push({
      type: reactionType,
      count: 1,
      users: [{ userId: user._id, userDisplayName: user.displayName }],
    });
  }
};

// @ts-ignore
export const removeReaction = (recipe, userId, reactionType) => {
  // @ts-ignore

  const reaction = recipe.reactions.find((r) => r.type === reactionType);
  if (reaction) {
    reaction.count--;
    // @ts-ignore

    const userIndex = reaction.users.findIndex((u) => u.userId.equals(userId));
    if (userIndex !== -1) {
      reaction.users.splice(userIndex, 1);
    }
    if (reaction.count === 0) {
      // @ts-ignore

      recipe.reactions = recipe.reactions.filter((r) => r !== reaction);
    }
  }
};
