import { registerAs } from '@nestjs/config';

export default registerAs('viaVarejo', () => ({
  port: +process.env.VIA_VAREJO_PORT || 15684,
  host: process.env.VIA_VAREJO_API_URL || 'https://via.varejo.sandox.com',
}));
