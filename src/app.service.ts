import { Injectable, OnModuleInit } from '@nestjs/common';
import { MeiliSearch } from 'meilisearch';

@Injectable()
export class AppService implements OnModuleInit {
  private meiliClient: MeiliSearch;
  private index = 'movies';

  constructor() {
    this.meiliClient = new MeiliSearch({
      host: 'http://meilisearch:7700',
      apiKey: 'masterKey',
    });

    // Check MeiliSearch Health
    this.meiliClient.health().then(console.log);
  }

  async onModuleInit() {
    await this.seed();
  }

  async createApiKey() {
    const key = await this.meiliClient.createKey({
      expiresAt: null,
      indexes: [this.index],
      name: 'Search API Key',
      actions: ['search', 'documents.get'],
      description: 'Use it to search from the frontend code',
    });

    return key;
  }

  private async seed() {
    const index = this.meiliClient.index(this.index);

    const documents = [
      { id: 1, title: 'Nick Mousavi', genres: ['Romance', 'Drama'] },
      { id: 2, title: 'Wonder Woman', genres: ['Action', 'Adventure'] },
      { id: 3, title: 'Life of Pi', genres: ['Adventure', 'Drama'] },
      { id: 4, title: 'Mad Max: Fury Road', genres: ['Adventure'] },
      { id: 5, title: 'Moana', genres: ['Fantasy', 'Action'] },
      { id: 6, title: 'Philadelphia', genres: ['Drama'] },
    ];

    await index.addDocuments(documents);
  }
}
