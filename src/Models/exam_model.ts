import Client from '../utils/db-config/database';

export type Exam = {
  course_id: string;
  course_name: string;
  exam_id: number;
  name: string;
  exam_instructions: string;
  start_date: Date;
  starting_time: string;
  ending_time: string;
  min_submit_time: string;
  max_attempts: number;
  professor_name: string;
};

export class ExamModel {
  tableName = 'exams';

  private static instance: ExamModel;
  private constructor() {
    // private constructor
  }
  static getInstance(): ExamModel {
    if (!ExamModel.instance) {
      ExamModel.instance = new ExamModel();
    }
    return ExamModel.instance;
  }

  async get_exam_details(exam_id: number): Promise<Exam | null> {
    try {
      const conn = await Client.connect();
      const sql1 = `select id,name,start_date,exam_instructions,start_time,end_time,min_submit_time,max_attempts,professor_id,course_id from ${this.tableName} where id = $1;`;

      const result1 = await conn.query(sql1, [exam_id]);

      if (result1.rows.length === 0) {
        conn.release();
        return null;
      }

      const sql2 = `select name from users where id = ${result1.rows[0]['professor_id']}`;
      const result2 = await conn.query(sql2);

      const sql3 = `select course_name from courses where course_id = $1;`;
      const result3 = await conn.query(sql3, [result1.rows[0]['course_id']]);

      conn.release();

      const exam_db: Exam = {
        course_id: result1.rows[0]['course_id'],
        course_name: result3.rows[0]['course_name'],
        exam_id: result1.rows[0]['id'],
        name: result1.rows[0]['name'],
        exam_instructions: result1.rows[0]['exam_instructions'],
        start_date: result1.rows[0]['start_date'],
        starting_time: result1.rows[0]['start_time'],
        ending_time: result1.rows[0]['end_time'],
        min_submit_time: result1.rows[0]['min_submit_time'],
        max_attempts: result1.rows[0]['max_attempts'],
        professor_name: result2.rows[0]['name'],
      };

      return exam_db;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  async get_exam_status(exam_id: number): Promise<string> {
    try {
      const conn = await Client.connect();
      const sql = `select status from ${this.tableName} where id = $1;`;
      const result = await conn.query(sql, [exam_id]);
      conn.release();

      return result.rows[0]['status'];
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  async end_exam(exam_id: number): Promise<boolean> {
    try {
      return true;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  async check_exam_password(
    exam_id: number,
    password: string
  ): Promise<boolean> {
    try {
      const conn = await Client.connect();
      const sql = `select * from ${this.tableName} where id = $1;`;

      const result = await conn.query(sql, [exam_id]);
      conn.release();

      return result.rows[0]['exam_password'] == password;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  async start_exam(exam_id: number): Promise<boolean> {
    try {
      return true;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }
}
