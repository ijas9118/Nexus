export class UsernameGenerator {
  static async generateUsername(
    fullName: string,
    checkUsernameExists: (username: string) => Promise<boolean>
  ): Promise<string> {
    const base = fullName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // remove special chars
      .trim()
      .replace(/\s+/g, '_'); // replace spaces with underscore

    let username = base;
    let suffix = 0;

    // Add suffix if needed
    while (await checkUsernameExists(username)) {
      suffix += 1;
      username = `${base}_${suffix}`;
    }

    return username;
  }
}
