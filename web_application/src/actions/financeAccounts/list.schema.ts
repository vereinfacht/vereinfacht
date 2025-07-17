import { z } from 'zod';
import { baseListSchema } from '../base/list.schema';

export const listFinanceAccountsSchema = baseListSchema;

export type ListFinanceAccountsParams = z.infer<
    typeof listFinanceAccountsSchema
>;
