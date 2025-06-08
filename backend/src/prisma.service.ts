import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
