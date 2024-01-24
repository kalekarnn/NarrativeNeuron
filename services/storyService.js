const constants = require("../common/constants");
const llamaClient = require("../clients/llamaClient");
const promptService = require("./promptService");
const storyApiClient = require("../clients/storyApiClient");

createNewStory = async () => {
  try {
    const genre = getRandomGenre();
    const type = getRandomType();
    const people = getRandomPeople();
    const country = getRandomCountry();

    let storyIds = [];
    const { story, storyId } = await createStory(genre, type, country, people);
    storyIds.push(storyId);

    let twists = [];
    for (let i = 0; i < constants.TWIST_COUNT; i++) {
      const result = await createTwist(story, storyId, country, people);
      twists.push(result);
      storyIds.push(result.twistId);
    }

    let finalTwists = [];
    for (let i = 0; i < twists.length; i++) {
      const data = twists[i];
      for (let j = 0; j < constants.TWIST_COUNT; j++) {
        const result = await createTwist(
          data.twist,
          data.twistId,
          country,
          people
        );
        finalTwists.push(result);
        storyIds.push(result.twistId);
      }
    }

    for (let i = 0; i < storyIds.length; i++) {
      await storyApiClient.publishTwists(storyIds[i]);
    }

    console.log(storyIds);
  } catch (err) {
    console.log("Failed to create new story.");
  }
};

async function createStory(type, genre, country, people) {
  const createStoryPrompt = promptService.getCreateStoryPrompt(
    type,
    genre,
    country,
    people
  );
  const story = await llamaClient.generate(createStoryPrompt);

  const createTitlePrompt = promptService.getCreateTitlePrompt(story);
  let title = await llamaClient.generate(createTitlePrompt);
  title = title.replace(/^"|"$/g, "");

  const storyId = await storyApiClient.createStory(story, title);

  return { story, storyId };
}

async function createTwist(story, parentId, country, people) {
  const type = getRandomType();
  const createTwistPrompt = promptService.getCreateTwistPrompt(
    type,
    story,
    country,
    people
  );
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

function getRandomCountry() {
  return constants.COUNTRY[
    Math.floor(Math.random() * constants.COUNTRY.length)
  ];
}

function getRandomPeople() {
  return constants.PEOPLE[Math.floor(Math.random() * constants.PEOPLE.length)];
}

module.exports = {
  createNewStory,
};
