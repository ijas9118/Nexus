import { v4 as uuidv4 } from 'uuid';

export class UsernameGenerator {
  static generateUsername(): string {
    const adjectives = ['Witty', 'Silly', 'Happy', 'Lazy', 'Grumpy', 'Quirky', 'Sleepy'];
    const nouns = ['Cactus', 'Penguin', 'Noodle', 'Muffin', 'Dolphin', 'Taco', 'Unicorn'];

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const shortUUID = uuidv4().slice(0, 6);

    return `${randomAdjective}${randomNoun}_${shortUUID}`;
  }
}
