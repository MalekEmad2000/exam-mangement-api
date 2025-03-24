import Client from '../utils/db-config/database';
import { Student, StudentModel } from './students_model';
// import { getMacAddress } from '../mac_address';

export type Exam_Log = {
  exam_id: number;
  student_id: string;
  ip_address: string;
  user_agent: any;
};

export class ExamLogModel {
  tableName = 'exam_logs';
  student_model = StudentModel.getInstance();

  private static instance: ExamLogModel;
  private constructor() {
    // private constructor
  }
  static getInstance(): ExamLogModel {
    if (!ExamLogModel.instance) {
      ExamLogModel.instance = new ExamLogModel();
    }
    return ExamLogModel.instance;
  }

  async create_start_log(
    exam_log: Exam_Log,
    byPassword: boolean
  ): Promise<boolean> {
    try {
      const conn = await Client.connect();
      const sql = `INSERT INTO exam_logs (time_stamp,exam_id, student_id, ip_addr, user_agent,action) VALUES (current_timestamp, $1 , $2, $3, $4, $5);`;

      // const max_address = await getMacAddress(exam_log.ip_address);
      // console.log('max_address = ' + max_address);
      const result = await conn.query(sql, [
        exam_log.exam_id,
        exam_log.student_id,
        exam_log.ip_address,
        exam_log.user_agent,
        'LOGIN' + (byPassword ? '_WITH_PASSWORD' : ''),
      ]);

      conn.release();

      if (result.rowCount == 1) {
        return true;
      }

      return false;
    } catch (err) {
      console.log(err);
      throw new Error(`Error: ${err}`);
    }
  }

  async create_submit_log(exam_log: Exam_Log): Promise<boolean> {
    try {
      const conn = await Client.connect();
      const sql = `INSERT INTO exam_logs (time_stamp,exam_id, student_id, ip_addr, user_agent,action) VALUES (current_timestamp, $1 , $2, $3, $4, $5 );`;
      const result = await conn.query(sql, [
        exam_log.exam_id,
        exam_log.student_id,
        exam_log.ip_address,
        exam_log.user_agent,
        'SUBMIT_EXAM',
      ]);
      conn.release();

      if (result.rowCount == 1) {
        return true;
      }
      return false;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  async create_disconnect_log(exam_log: Exam_Log): Promise<boolean> {
    try {
      const conn = await Client.connect();
      const sql = `INSERT INTO exam_logs (time_stamp,exam_id, student_id, ip_addr, user_agent,action) VALUES (current_timestamp, $1 , $2, $3, $4, $5 );`;

      conn.query(sql, [
        exam_log.exam_id,
        exam_log.student_id,
        exam_log.ip_address,
        exam_log.user_agent,
        'DISCONNECT',
      ]);
      conn.release();

      return true;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  async create_choice_log(
    exam_log: Exam_Log,
    question_id: string,
    choice_id: number,
    section_id: number
  ): Promise<boolean> {
    try {
      console.log('creating choice logs');
      const conn = await Client.connect();
      const sql = `INSERT INTO exam_logs (time_stamp, action, exam_id, student_id, ip_addr,  question_id, student_choice, user_agent, section_id) VALUES (current_timestamp, 'ANSWER_QUESTION', $1 , $2, $3, $4, $5, $6, $7 );`;
      const result = await conn.query(sql, [
        exam_log.exam_id,
        exam_log.student_id,
        exam_log.ip_address,
        question_id,
        choice_id,

        exam_log.user_agent,
        section_id,
      ]);

      conn.release();

      if (result.rowCount == 1) {
        return true;
      }
      return false;
    } catch (err) {
      console.log(err);
      throw new Error(`Error: ${err}`);
    }
  }
}
