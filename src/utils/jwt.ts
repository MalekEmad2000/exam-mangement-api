import jwt from 'jsonwebtoken';

export interface JWTObject {
  exam_id: number;
  student_id: string;
}

export class JWTHelper {
  static sign(obj: JWTObject): string {
    return jwt.sign(obj, this.getJWTSecret());
  }

  static verify(token: string): JWTObject {
    return jwt.verify(token, this.getJWTSecret()) as JWTObject;
  }

  static getStudentID(token: string): string {
    return this.verify(token).student_id;
  }

  static getExamID(token: string): number {
    return this.verify(token).exam_id;
  }

  private static getJWTSecret(): string {
    return 'secret';
  }
}
