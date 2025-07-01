import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

export default class Password {
  static readonly rndbyt = 32; // Random Bytes Length
  static readonly keylen = 128; // Key length. Duh.

  static hash(password: string): string {
    const salt = randomBytes(this.rndbyt).toString('hex');
    const buffer = scryptSync(password, salt, this.keylen);
    return `${buffer.toString('hex')}.${salt}`;
  }

  static compare(hash: string, password: string): boolean {
    const [_hash, salt] = hash.split('.');
    const hb = Buffer.from(_hash, 'hex'); // Hashed buffer
    const pb = scryptSync(password, salt, this.keylen); // Password buffer
    return timingSafeEqual(hb, pb);
  }
}
