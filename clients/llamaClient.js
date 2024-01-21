const axios = require("axios");
require("dotenv").config();

generate = async (prompt) => {
  let data = JSON.stringify({
    model: "llama2",
    prompt: prompt,
    stream: false,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: process.env.OLLAMA_SERVER,
    headers: {
      stream: "false",
      "Content-Type": "application/json",
    },
    data: data,
  };

  const result = await axios.request(config);
  return result.data.response;
};

module.exports = {
  generate,
};
