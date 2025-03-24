import Client from '../utils/db-config/database';
import { Question, Question_Model } from './questions_model';

export type Section = {
  exam_id: number;
  section_id: number;
  random_shuffle: boolean;
  section_title: string;
  questions: Array<Question>;
  section_order: number | null;
};

export type Section_Details_ids_only = {
  section_id: number;
  random_shuffle: boolean;
  questions_ids: Array<number>;
};

export class ExamSectionModel {
  exam_sections_table = 'exam_sections';
  section_questions_table = 'section_questions';

  private static instance: ExamSectionModel;
  private constructor() {
    // private constructor
  }
  static getInstance(): ExamSectionModel {
    if (!ExamSectionModel.instance) {
      ExamSectionModel.instance = new ExamSectionModel();
    }
    return ExamSectionModel.instance;
  }
  question_model = Question_Model.getInstance();

  async get_exam_sections(exam_id: number): Promise<Array<Section>> {
    try {
      const conn = await Client.connect();
      const sql1 = `select section_id,random_shuffle,section_title from ${this.exam_sections_table} where exam_id = ${exam_id};`;

      const result1 = await conn.query(sql1);
      conn.release();

      const sec: Array<Section> = Array<Section>(result1.rows.length);

      for (let i = 0; i < result1.rows.length; i++) {
        sec[i] = {
          exam_id: exam_id,
          section_id: result1.rows[i]['section_id'],
          random_shuffle: result1.rows[i]['random_shuffle'],
          section_title: result1.rows[i]['section_title'],
          questions: await this.get_exam_sections_questions(
            exam_id,
            result1.rows[i]['section_id']
          ),
          section_order: null,
        };
      }

      return sec;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  async get_exam_sections_questions(
    exam_id: number,
    section_id: number
  ): Promise<Array<Question>> {
    try {
      const conn = await Client.connect();
      const sql1 = `select question_id, question_id as question_order, weight from ${this.section_questions_table} where exam_id = ${exam_id} and section_id = ${section_id};`;

      const result1 = await conn.query(sql1);
      conn.release();

      const questions: Array<Question> = Array<Question>(result1.rows.length);

      for (let i = 0; i < result1.rows.length; i++) {
        questions[i] = await this.question_model.get_question(
          result1.rows[i]['question_id'],
          section_id,
          result1.rows[i]['weight']
        );
      }

      return questions;
    } catch (err) {
      console.log('ERROR AT SECTION QUEST', err);

      throw new Error(`Error: ${err}`);
    }
  }

  async get_exam_sections_questions_ids(
    exam_id: number,
    section_id: number
  ): Promise<Array<number>> {
    try {
      const conn = await Client.connect();
      const sql1 = `select question_id,question_id as question_order from ${this.section_questions_table} where exam_id = ${exam_id} and section_id = ${section_id};`;

      const result1 = await conn.query(sql1);
      conn.release();

      result1.rows.sort((a, b) => {
        return a['question_order'] - b['question_order'];
      });

      return result1.rows.map((row) => {
        return row['question_id'];
      });
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  async get_sections_details(
    exam_id: number
  ): Promise<Array<Section_Details_ids_only>> {
    try {
      const conn = await Client.connect();
      const sql1 = `select section_id,random_shuffle from ${this.exam_sections_table} where exam_id = $1;`;

      const result1 = await conn.query(sql1, [exam_id]);
      conn.release();

      const sec: Array<Section_Details_ids_only> =
        Array<Section_Details_ids_only>(result1.rows.length);

      for (let i = 0; i < result1.rows.length; i++) {
        sec[i] = {
          section_id: result1.rows[i]['section_id'],
          random_shuffle: result1.rows[i]['random_shuffle'],
          questions_ids: await this.get_exam_sections_questions_ids(
            exam_id,
            result1.rows[i]['section_id']
          ),
        };
      }

      return sec;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }
}
