import Client from '../utils/db-config/database';

export type Student = {
  id: string;
  name: string;
  national_id: string;
  email: string;
  exam_id: number;
};

export type Student_Pass = {
  id: string;
  name: string;
  exam_password: string;
  exam_id: number;
};

export function validate_student_vairables(student: Student): boolean {
  if (!student.email) {
    return false;
  }
  if (!student.id) {
    return false;
  }
  if (!student.name) {
    return false;
  }
  if (!student.national_id) {
    return false;
  }

  if (!student.exam_id) {
    return false;
  }

  return true;
}

export class StudentModel {
  private static instance: StudentModel;
  private constructor() {
    // private constructor
  }
  static getInstance(): StudentModel {
    if (!StudentModel.instance) {
      StudentModel.instance = new StudentModel();
    }
    return StudentModel.instance;
  }

  tableName = 'students';

  async check_and_update_student(student: Student): Promise<Student | null> {
    try {
      const conn = await Client.connect();
      const sql = `select * from ${this.tableName} where id = '${student.id}' and exam_id = ${student.exam_id};`;

      const result = await conn.query(sql);

      let std: Student | null = null;

      if (result.rows[0] === undefined) {
        conn.release();
        return std;
      }

      const sql1 = `update ${this.tableName} set name = '${student.name}', national_id = '${student.national_id}', email = '${student.email}'  where  id = '${student.id}' and exam_id = ${student.exam_id};`;

      await conn.query(sql1);

      conn.release();
      std = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        national_id: result.rows[0].national_id,
        email: result.rows[0].email,
        exam_id: result.rows[0].exam_id,
      };
      return std;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  async make_student_active(student: Student): Promise<void> {
    try {
      const conn = await Client.connect();
      const sql = `update ${this.tableName} set status = 'ACTIVE' where id = '${student.id}' and exam_id = ${student.exam_id};`;

      await conn.query(sql);
      conn.release();
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  async student_in_db(student: Student): Promise<boolean> {
    try {
      const conn = await Client.connect();
      const sql = `select * from ${this.tableName} where id=(${student.id} and name='${student.name}' and national_id='${student.national_id}' and email='${student.email}');`;

      const result = await conn.query(sql);
      conn.release();

      if (result.rowCount == 0) {
        return false;
      }
      return true;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  async is_student_submitted(student: Student): Promise<boolean> {
    try {
      const conn = await Client.connect();
      const sql = `select status from ${this.tableName} where id = '${student.id}' and exam_id = ${student.exam_id};`;

      const result = await conn.query(sql);
      conn.release();

      return (
        result.rows[0].status == 'SUBMITTED_BY_HIMSELF' ||
        result.rows[0].status == 'SUBMITTED_BY_PROFESSOR'
      );
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  async is_student_active(student: Student): Promise<boolean> {
    try {
      const conn = await Client.connect();
      const sql = `select status from ${this.tableName} where id = '${student.id}' and exam_id = ${student.exam_id};`;

      const result = await conn.query(sql);
      conn.release();

      return result.rows[0].status == 'ACTIVE';
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  async update_student_is_submitted(student: Student): Promise<void> {
    try {
      const conn = await Client.connect();

      const sql1 = `select status from ${this.tableName} where id = '${student.id}' and exam_id = ${student.exam_id};`;
      const result1 = await conn.query(sql1);

      if (result1.rows[0].status != 'SUBMITTED_BY_PROFESSOR') {
        const sql = `update ${this.tableName} set status = 'SUBMITTED_BY_HIMSELF' where id = '${student.id}' and exam_id = ${student.exam_id};`;

        await conn.query(sql);
      }

      conn.release();
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  async make_student_disconnected(
    student_id: string,
    exam_id: string
  ): Promise<void> {
    try {
      const conn = await Client.connect();
      const sql = `update ${this.tableName} set status = 'DISCONNECTED' where id = '${student_id}' and exam_id = ${exam_id};`;

      await conn.query(sql);
      conn.release();
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  async decrease_student_attempts(student: Student): Promise<boolean> {
    try {
      const conn = await Client.connect();

      const sql = `select remaining_attempts from ${this.tableName} where id = '${student.id}' and exam_id = ${student.exam_id};`; // get remaining attempts

      const result = await conn.query(sql);

      if (result.rows[0].remaining_attempts == 0) {
        conn.release();
        return false;
      }

      const sql1 = `update ${this.tableName} set remaining_attempts = remaining_attempts - 1 where id = '${student.id}' and exam_id = ${student.exam_id};`;
      conn.query(sql1);
      conn.release();

      return true;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  async get_student(id: string, exam_id: number): Promise<Student | null> {
    try {
      const conn = await Client.connect();
      const sql = `select * from ${this.tableName} where id = '${id}' and exam_id = ${exam_id};`;
      const result = await conn.query(sql);
      conn.release();

      if (result.rows[0] === undefined) {
        return null;
      }

      let std: Student | null = null;
      std = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        national_id: result.rows[0].national_id,
        email: result.rows[0].email,
        exam_id: result.rows[0].exam_id,
      };

      return std;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }
}
