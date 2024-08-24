import Dexie, { type EntityTable } from 'dexie';
import Spark from './Spark';

export default class AppDB extends Dexie {
  sparks!: EntityTable<Spark, 'id'>;

  constructor() {
    super('SparksDB');
    this.version(3).stores({
      sparks: '++id, creationDate',
      tags: '++id, name',
        sparkTags: '++id, sparkId, tagId'
    });
    this.sparks.mapToClass(Spark);
  }
}