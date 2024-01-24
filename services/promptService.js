const constants = require("../common/constants");

getCreateStoryPrompt = (type, genre, country, people) => {
  return `You are a famous story writer from country ${country}. 
  You are popular for writing stories for ${people}. Now create a ${type} story of genre ${genre} in ${constants.STORY_LENGTH} words without title`;
};

getCreateTitlePrompt = (story) => {
  return `Given the story "${story}" create a title in ${constants.TITLE_LENGTH} words`;
};

getCreateTwistPrompt = (type, story, country, people) => {
  return `You are a famous story writer from country ${country}. 
  You are popular for writing stories for ${people}.
  Given the story ${story} create further ${type} story in ${constants.STORY_LENGTH} words without title`;
};

module.exports = {
  getCreateStoryPrompt,
  getCreateTitlePrompt,
  getCreateTwistPrompt,
};
