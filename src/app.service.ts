import { DummyUserClient } from '@app/dummy/clients';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly dummyUserClient: DummyUserClient) {}

  getHello() {
    const userId = 1;

    return this.dummyUserClient.getSingleUser(userId);
  }
}
