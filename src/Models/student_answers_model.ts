import Client from '../utils/db-config/database';
import {
  ExamSectionModel,
  Section_Details_ids_only,
} from './exam_sections_model';

export type Student_Answers = {
  question_id: string;
  choice_id: number;
  section_id: number;
};

export type Student_Choice_order = {
  question_order: number;
  student_choice: number;
};

const exam_section_model = ExamSectionModel.getInstance();

export class StudentAnswersModel {
  tableName = 'student_answers';

  private static instance: StudentAnswersModel;
  private constructor() {
    // private constructor
  }
  static getInstance(): StudentAnswersModel {
    if (!StudentAnswersModel.instance) {
      StudentAnswersModel.instance = new StudentAnswersModel();
    }
    return StudentAnswersModel.instance;
  }

  async create_student_exam_default_answers(
    exam_id: number,
    student_id: string
  ): Promise<boolean> {
    try {
      let examSections: Array<Section_Details_ids_only> =
        await exam_section_model.get_sections_details(exam_id);

      const conn = await Client.connect();

      const sql1 = `select * from ${this.tableName} where student_id = $1 and exam_id = $2;`;

      const result = await conn.query(sql1, [student_id, exam_id]);
      if (result.rows.length > 0) {
        conn.release();
        return false;
      }

      const sql = `insert into ${this.tableName} (student_id, question_id, exam_id, question_order, section_id, section_order) values ($1, $2, $3, $4, $5, $6);`;

      examSections = examSections.sort(() => Math.random() - 0.5);
      for (let i = 0; i < examSections.length; i++) {
        const random_shuffle = examSections[i].random_shuffle;
        let questions_ids = examSections[i].questions_ids;

        if (random_shuffle) {
          questions_ids = questions_ids.sort(() => Math.random() - 0.5);
        }

        for (let j = 0; j < questions_ids.length; j++) {
          // let qid = questions_ids[j];
          await conn.query(sql, [
            student_id,
            questions_ids[j],
            exam_id,
            j,
            examSections[i].section_id,
            i,
          ]);
        }
      }
      conn.release();

      return true;
    } catch (err) {
      throw new Error(`Error: ${err}`);
      return false;
    }
  }

  async get_student_choosen_answers(
    exam_id: number,
    student_id: string
  ): Promise<Student_Answers[]> {
    try {
      const sql = `SELECT *  FROM ${this.tableName} WHERE student_id = $1 and exam_id = $2;`;
      const conn = await Client.connect();
      const result = await conn.query(sql, [student_id, exam_id]);
      conn.release();

      const student_answers: Student_Answers[] = [];
      for (let i = 0; i < result.rows.length; i++) {
        student_answers.push({
          question_id: result.rows[i]['question_id'],
          choice_id: result.rows[i]['student_choice'],
          section_id: result.rows[i]['section_id'],
        });
      }

      return student_answers;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  async get_student_section_order(
    exam_id: number,
    student_id: string,
    section_id: number
  ): Promise<number> {
    try {
      const sql = `SELECT max(section_order) as section_order FROM student_answers WHERE student_id = $1 and exam_id = $2 and section_id = $3 GROUP BY section_id;`;
      const conn = await Client.connect();

      const sections_result = await conn.query(sql, [
        student_id,
        exam_id,
        section_id,
      ]);
      conn.release();

      return sections_result.rows[0]['section_order'];
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  async get_student_question_choice_order(
    exam_id: number,
    student_id: string,
    section_id: number,
    question_id: number
  ): Promise<Student_Choice_order> {
    try {
      const sql = `SELECT question_order, student_choice FROM student_answers WHERE student_id = $1 and exam_id = $2 and section_id = $3 and question_id = $4;`;

      const conn = await Client.connect();
      const sections_result = await conn.query(sql, [
        student_id,
        exam_id,
        section_id,
        question_id,
      ]);
      conn.release();

      return {
        student_choice: sections_result.rows[0]['student_choice'],
        question_order: sections_result.rows[0]['question_order'],
      };
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  async set_answers(
    exam_id: number,
    student_id: string,
    answers: Array<Student_Answers>
  ): Promise<boolean> {
    try {
      if (answers.length == 0) {
        return true;
      }
      const sql = `UPDATE ${this.tableName} SET student_choice = $1 WHERE student_id = $2 and exam_id = $3 and question_id = $4 and section_id = $5 ;`;

      const conn = await Client.connect();
      for (let i = 0; i < answers.length; i++) {
        await conn.query(sql, [
          answers[i].choice_id,
          student_id,
          exam_id,
          answers[i].question_id,
          answers[i].section_id,
        ]);
      }

      conn.release();
      return true;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }
}
