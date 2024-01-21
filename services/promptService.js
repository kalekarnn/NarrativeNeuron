const constants = require("../common/constants");

getCreateStoryPrompt = (type, genre) => {
  return `create a ${type} story of genre ${genre} in ${constants.STORY_LENGTH} words without title`;
};

getCreateTitlePrompt = (story) => {
  return `Given the story "${story}" create a title in ${constants.TITLE_LENGTH} words`;
};

getCreateTwistPrompt = (type, story) => {
  return `Given the story ${story} create further ${type} story in ${constants.STORY_LENGTH} words without title`;
};

module.exports = {
  getCreateStoryPrompt,
  getCreateTitlePrompt,
  getCreateTwistPrompt,
};
