const storyService = require("./services/storyService");

async function main() {
  for (let i = 0; i < 25; i++) {
    await storyService.createNewStory();
  }
}

main();
