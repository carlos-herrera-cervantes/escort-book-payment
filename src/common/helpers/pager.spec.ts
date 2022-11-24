import { Paginate } from '../dto/query-param.dto';
import { Pager } from './pager';

describe('Pager', () => {
  it('getPager - Should return pager object', () => {
    const paginate = new Paginate();
    paginate.offset = 0;
    paginate.limit = 10;
    const totalDocs: number = 0;
    const data: string[] = [];

    const pagerResult = new Pager<string>(paginate, totalDocs, data).getPager();

    expect(pagerResult.total).toEqual(totalDocs);
    expect(pagerResult.data.length).toBeFalsy();
    expect(pagerResult.hasPrevious).toBeFalsy();
    expect(pagerResult.hasNext).toBeFalsy();
    expect(pagerResult.page).toEqual(paginate.offset);
    expect(pagerResult.pageSize).toEqual(paginate.limit);
  });
});
