// Create PostgreSQL Connection Pool here !
import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString:
    "postgresql://postgres:Kan123456@localhost:5432/SkillCheckpoint",
});

export default connectionPool;
