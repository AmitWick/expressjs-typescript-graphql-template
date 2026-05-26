type FindFirstFn<U, Filter> = (filter: Filter) => Promise<U | null>;

type FindManyFn<U, Filter> = (filter: Filter) => Promise<(U | null)[]>;

type CreateOneFn<U, Create> = ({ data }: { data: Create }) => Promise<U>;

interface RedisRepositoryOptions<U, Filter, Create> {
  prefix: string;
  ttl?: number;
  findFirst: FindFirstFn<U, Filter>;
  findMany: FindManyFn<U, Filter>;
  createOne: CreateOneFn<U, Create>;
}

export class RedisQuery<U, Filter, Create> {
  private prefix: string;

  private ttl: number;

  private findFirstFn: FindFirstFn<U, Filter>;

  private findManyFn: FindManyFn<U, Filter>;

  private createOneFn: CreateOneFn<U, Create>;

  constructor(option: RedisRepositoryOptions<U, Filter, Create>) {
    this.prefix = option.prefix;
    this.ttl = option.ttl ?? 3600;
    this.findFirstFn = option.findFirst;
    this.findManyFn = option.findMany;
    this.createOneFn = option.createOne;
  }

  private buildKey(id: string) {
    return `${this.prefix}:${id}`;
  }

  async getFirst(id: string, filter: Filter) {
    const key = this.buildKey(id);

    // const cached = await redisClient.get(key);

    // if (cached) {
    //   return JSON.parse(cached) as U;
    // }

    const user = await this.findFirstFn(filter);

    // if (user) {
    //   await redisClient.set(key, JSON.stringify(user), "EX", this.ttl);
    // }

    return user;
  }

  async getMany(id: string[], filter: Filter) {
    const users = await this.findManyFn(filter);

    return users;
  }

  async set(data: Create) {
    const user = await this.createOneFn({
      data,
    });
    return user;
  }

  mget() {}
}
