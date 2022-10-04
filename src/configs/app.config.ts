import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: 8037,
  microservices: {
    redeB2b: {
      port: +process.env.REDE_B2B_TCP_PORT || 15684,
      host: process.env.REDE_B2B_API_URL || 'localhost',
    },
  },
  integrationToken: process.env.TOTVS_INTEGRATION_TOKEN || 'f5b265f7-050e-4481-a812-83626c1be27d',
}));
