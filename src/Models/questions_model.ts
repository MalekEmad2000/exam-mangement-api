import Client from '../utils/db-config/database';

//TODO Handle Diagrams

export type Question_Choices = {
  question_id: number;
  choice_text: string;
  choice_id: number;
};

export type Question = {
  question_id: number;
  has_diagram: boolean;
  question_text: string;
  question_choices: Array<Question_Choices>;
  question_order: number | null;
  section_id: number;
  weight: number | null;
  student_choice: number | null;
};

export class Question_Model {
  questions_table = 'section_questions';
  question_choices_table = 'section_question_choices';

  private static instance: Question_Model;
  private constructor() {
    // private constructor
  }
  static getInstance(): Question_Model {
    if (!Question_Model.instance) {
      Question_Model.instance = new Question_Model();
    }
    return Question_Model.instance;
  }

  async get_question_image(
    exam_id: number,
    question_id: number,
    section_id: number
  ): Promise<string | null> {
    try {
      const conn = await Client.connect();
      const sql = `select encode(section_questions.diagram::bytea, 'base64') as diagram from ${this.questions_table} where question_id = ${question_id} and section_id = ${section_id} and exam_id = ${exam_id}`;

      const result = await conn.query(sql);
      conn.release();

      if (result.rows.length === 0) {
        return null;
      }
      const image: string = result.rows[0].diagram;
      return image;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  async get_question(
    question_id: number,
    section_id: number,
    weight: number
  ): Promise<Question> {
    try {
      const conn = await Client.connect();
      const sql = `select question_id,question_text, CASE
        WHEN diagram IS NOT NULL THEN true
        ELSE false END as has_diagram from ${this.questions_table} where question_id = ${question_id} and section_id = ${section_id};`;
      const result = await conn.query(sql);
      conn.release();

      const question: Question = {
        question_id: result.rows[0]['question_id'],
        has_diagram: result.rows[0]['has_diagram'] as boolean,
        question_text: result.rows[0]['question_text'],
        question_choices: await this.get_question_choices(
          question_id,
          section_id
        ),
        question_order: null,
        weight: weight,
        section_id: section_id,
        student_choice: null,
      };

      return question;
    } catch (err) {
      console.log('ERROR AT QUESTION', err);
      throw new Error(`Error: ${err}`);
    }
  }

  async get_question_choices(
    question_id: number,
    section_id: number
  ): Promise<Question_Choices[]> {
    try {
      const conn = await Client.connect();
      const sql = `select question_id,choice_text,choice_id from ${this.question_choices_table} where question_id = ${question_id} and section_id = ${section_id};`;

      const result = await conn.query(sql);
      conn.release();

      const question_choices: Array<Question_Choices> = Array<Question_Choices>(
        result.rows.length
      );

      for (let i = 0; i < result.rows.length; i++) {
        question_choices[i] = {
          question_id: result.rows[i]['question_id'],
          choice_text: result.rows[i]['choice_text'],
          choice_id: result.rows[i]['choice_id'],
        };
      }
      return question_choices;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }
}
