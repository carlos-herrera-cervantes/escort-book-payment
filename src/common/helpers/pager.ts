import { Paginate } from '../dto/query-param.dto';

export class Pager<T> {
  public readonly total: number;
  public readonly data: T[];
  public readonly page: number;
  public readonly pageSize: number;
  public readonly hasNext: boolean;
  public readonly hasPrevious: boolean;

  constructor(paginate: Paginate, totalDocs: number, data: T[]) {
    const { offset, limit } = paginate;
    const skip: number = offset * limit;

    this.total = totalDocs;
    this.data = data;
    this.page = offset;
    this.pageSize = limit;
    this.hasNext = skip + limit < totalDocs;
    this.hasPrevious = !(offset == 0);
  }

  getPager(): Pager<T> {
    return this;
  }
}
