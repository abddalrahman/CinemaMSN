import { Pool, types } from "pg";

types.setTypeParser(1082, (val) => {
  return val; 
});

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
    rejectUnauthorized: false, 
  },
	connectionTimeoutMillis: 30000, // وقت المهلة للاتصال مع قواعد البيانات 
	idleTimeoutMillis: 60000, // إغلاق الاتصالات الخاملة بعد 60 ثانية
});

export default pool;