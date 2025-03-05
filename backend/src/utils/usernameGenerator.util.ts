export class UsernameGenerator {
  // Generate a random username
  static generateUsername(): string {
    const adjectives = ['Witty', 'Silly', 'Happy', 'Lazy', 'Grumpy', 'Quirky', 'Sleepy'];
    const nouns = ['Cactus', 'Penguin', 'Noodle', 'Muffin', 'Dolphin', 'Taco', 'Unicorn'];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit number

    return `${randomAdjective}${randomNoun}${randomNum}`;
  }
}
