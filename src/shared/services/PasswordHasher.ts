// https://gist.github.com/mba7/979e6c3fe715fc618549fae4d09019ef

/**
 * Hash a string using Nodes asynchronous pbkdf2 function.
 *
 * Returns promise with a self-contained buffer encoded with config.encoding
 * that contains all the data needed to verify a password:
       -----------------------
       | SaltLen |     4     |
       -----------------------
       | Salt    | saltBytes |
       -----------------------
       | HashLen |     4     |
       -----------------------
       | Salt    | hashBytes |
       - ---------------------
*/

import crypto from 'crypto';

const encoding = 'base64';

const config = {
  // size of the generated hash
  hashBytes: 32,
  // larger salt means hashed passwords are more resistant to rainbow table, but
  // you get diminishing returns pretty fast
  saltBytes: 16,
  // Hashing algorithm
  algorythm: 'sha512',
  // more iterations means an attacker has to take longer to brute force an
  // individual password, so larger is better. however, larger also means longer
  // to hash the password. tune so that hashing the password takes about a
  // second
  iterations: 872791,
};

export class PasswordHasher {
  async hashPassword(password: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      // generate a salt for pbkdf2
      crypto.randomBytes(config.saltBytes, async (err, salt) => {
        if (err) reject(err);

        crypto.pbkdf2(password, salt, config.iterations, config.hashBytes, config.algorythm, async (err, hash) => {
          if (err) reject(err);

          const combined = await Buffer.alloc(hash.length + salt.length + 8);

          // include the size of the salt so that we can, during verification,
          // figure out how much of the hash is salt
          await combined.writeUInt32BE(salt.length, 0);
          // similarly, include the iteration count
          await combined.writeUInt32BE(config.iterations, 4);

          await salt.copy(combined, 8);
          await hash.copy(combined, salt.length + 8);
          resolve(combined);
        });
      });
    });
  }

  async verifyPassword(password: string, combined: Buffer): Promise<boolean> {
    // extract the salt and hash from the combined buffer
    const saltBytes = combined.readUInt32BE(0);
    const hashBytes = combined.length - saltBytes - 8;
    const iterations = combined.readUInt32BE(4);
    const salt = combined.slice(8, saltBytes + 8);
    const hash = combined.toString('binary', saltBytes + 8);

    return new Promise(async (resolve, reject) => {
      // verify the salt and hash against the password
      await crypto.pbkdf2(password, salt, iterations, hashBytes, config.algorythm, async (error, verify) => {
        if (error) reject(error);
        const isEqual = verify.toString('binary') === hash;

        resolve(isEqual);
      });
    });
  }

  async hashToBuffer(hash: string): Promise<Buffer> {
    const buffer = await Buffer.from(hash, encoding);

    return buffer;
  }

  async bufferToHash(buffer: Buffer): Promise<string> {
    const hash = await buffer.toString(encoding);

    return hash;
  }
}
