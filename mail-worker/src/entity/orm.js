import { drizzle } from 'drizzle-orm/d1';

export default function orm(c) {
	return drizzle(c.env.d1,{logger: c.env.orm_log})
}
