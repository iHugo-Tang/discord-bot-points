import 'dotenv/config';
import { getRPSChoices } from './game.js';
import { capitalize, InstallGlobalCommands } from './utils.js';

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

// Simple test command
const REG_COMMAND = {
  name: 'register',
  description: '注册',
  type: 1,
};

const LEADERBOARD_COMMAND = {
  name: 'leaderboard',
  description: '积分排行榜',
  type: 1,
};

const POINTS_COMMAND = {
  name: 'points',
  description: '个人积分,以及最近的消费记录',
  type: 1,
};

const GOODS_COMMAND = {
  name: 'goods',
  description: '可以兑换的商品',
  type: 1,
};

// Command containing options
// const CHALLENGE_COMMAND = {
//   name: 'challenge',
//   description: 'Challenge to a match of rock paper scissors',
//   options: [
//     {
//       type: 3,
//       name: 'object',
//       description: 'Pick your object',
//       required: true,
//       choices: createCommandChoices(),
//     },
//   ],
//   type: 1,
// };

const ALL_COMMANDS = [REG_COMMAND, LEADERBOARD_COMMAND, POINTS_COMMAND, GOODS_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
