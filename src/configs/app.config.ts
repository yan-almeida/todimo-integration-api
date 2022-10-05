import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: 3000,
  microservices: {
    rede: {
      port: +process.env.REDE_TCP_PORT || 15684,
      host: process.env.REDE_API_URL || 'localhost',
    },
    // viaVarejo: {
    //   port: +process.env.VIA_VAREJO_PORT || 15684,
    //   host: process.env.VIA_VAREJO_API_URL || 'https://via.varejo.sandox.com',
    // },
    // se encontra no seguinte arquivo: ./via-varejo.config.ts
  },
}));

// app.microservices.viaVarejo
// viaVarejo.(port|host) -> viaVarejo
//
