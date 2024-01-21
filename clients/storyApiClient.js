const axios = require("axios");
require("dotenv").config();

const token = process.env.TOKEN;

createStory = async (body, title) => {
  const data = {
    body: body,
    title: title,
  };

  const storyResult = await axios.post(
    "https://story3.com/api/v2/stories",
    data,
    {
      headers: {
        "x-auth-token": token,
      },
    }
  );
  const rootHashId = storyResult.data.hashId;
  return rootHashId;
};

createTwist = async (body, title, hashParentId) => {
  const data = {
    body: body,
    title: title,
    hashParentId: hashParentId,
    isExtraTwist: true,
  };
  const twistRes = await axios.post(`https://story3.com/api/v2/twists`, data, {
    headers: {
      "x-auth-token": token,
    },
  });
  const twistHashId = twistRes.data.hashId;
  return twistHashId;
};

publishTwists = async (hashId) => {
  const twistRes = await axios.post(
    `https://story3.com/api/v2/twists/${hashId}/publish`,
    null,
    {
      headers: {
        "x-auth-token": token,
      },
    }
  );
};

module.exports = {
  createStory,
  createTwist,
  publishTwists,
};
