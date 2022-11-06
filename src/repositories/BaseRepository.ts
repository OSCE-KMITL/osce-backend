/**
 * @param T type of Entity.
 * @param target A column in database or property of Entity
 * @param value  A value of column
 */

export interface BaseRepository<T> {
  find(): Promise<T[]>;
  find(target: string, value: string): Promise<T[]>;
  findOne(target: string, value: string): Promise<T | null>;
  create(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(entity: T): Promise<T>;
}
