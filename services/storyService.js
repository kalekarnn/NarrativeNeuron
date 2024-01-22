const constants = require("../common/constants");
const llamaClient = require("../clients/llamaClient");
const promptService = require("./promptService");
const storyApiClient = require("../clients/storyApiClient");

createNewStory = async () => {
  try {
    let storyIds = [];
    const { story, storyId } = await createStory();
    storyIds.push(storyId);

    let twists = [];
    for (let i = 0; i < constants.TWIST_COUNT; i++) {
      const result = await createTwist(story, storyId);
      twists.push(result);
      storyIds.push(result.twistId);
    }

    let finalTwists = [];
    for (let i = 0; i < twists.length; i++) {
      const data = twists[i];
      for (let j = 0; j < constants.TWIST_COUNT; j++) {
        const result = await createTwist(data.twist, data.twistId);
        finalTwists.push(result);
        storyIds.push(result.twistId);
      }
    }

    console.log(storyIds);
    for (let i = 0; i < storyIds.length; i++) {
      await storyApiClient.publishTwists(storyIds[i]);
    }
  } catch (err) {
    console.log(err);
  }
};

async function createStory() {
  const genre = getRandomGenre();
  const type = getRandomType();

  const createStoryPrompt = promptService.getCreateStoryPrompt(type, genre);
  const story = await llamaClient.generate(createStoryPrompt);

  const createTitlePrompt = promptService.getCreateTitlePrompt(story);
  let title = await llamaClient.generate(createTitlePrompt);
  title = title.replace(/^"|"$/g, "");

  const storyId = await storyApiClient.createStory(story, title);

  return { story, storyId };
}

async function createTwist(story, parentId) {
  const type = getRandomType();
  const createTwistPrompt = promptService.getCreateTwistPrompt(type, story);
  const twist = await llamaClient.generate(createTwistPrompt);

  const createTitlePrompt = promptService.getCreateTitlePrompt(twist);
  let title = await llamaClient.generate(createTitlePrompt);
  title = title.replace(/^"|"$/g, "");

  const twistId = await storyApiClient.createTwist(twist, title, parentId);
  return { twist, twistId };
}

getRandomGenre = () => {
  const index = Math.floor(Math.random() * constants.GENRE.length);
  return constants.GENRE[index];
};

getRandomType = () => {
  const index = Math.floor(Math.random() * constants.TYPE.length);
  return constants.TYPE[index];
};

module.exports = {
  createNewStory,
};
