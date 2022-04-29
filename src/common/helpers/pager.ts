import { PaginateDTO } from '../dto/query-param.dto';

export class Pager {
  private next: number;
  private previous: number;
  private total: number;
  private data: any[];

  getPager(paginate: PaginateDTO, totalDocs: number, data: any[]): Pager {
    const current = paginate.offset == 0 ? 1 * paginate.limit : paginate.offset * paginate.limit;
    this.next = current < totalDocs ? paginate.offset + 1 : 0;
    this.previous = current > paginate.limit ? paginate.offset - 1 : 0;
    this.total = totalDocs;
    this.data = data;

    return this;
  }
}