import { registerAs } from '@nestjs/config';

export default registerAs('dummy', () => ({
  url: process.env.DUMMY_BASE_URL || 'https://dummyjson.com',
}));
