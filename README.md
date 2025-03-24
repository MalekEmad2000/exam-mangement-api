# 2 - public IP APIs

### Login to exam

check if exam already started or not
Create or update student

Insert all answers in student answer table

```bash
Request
        POST /exams/login?exam_id=1
```

Request

```json
 Header
Authorization: token (TODO : not now)
body :
{
        "exam_id": 1,
        "student_id": 1,
        "student_name": "test", ",....etc(data of student)
}
```

Response

```json

On Success
{
        "status": "OK",
        "message": "Student added successfully",
        "student_id": 1,
        "student_name": "test", ",....etc(data of student)"
}

On Failiure
{
        "status": "FAIL",
        "message": "Student not found"
}
```

### Get exam details questions and choices

```bash
Request
        GET /exams/details?exam_id=1
```

Request

````json
 Header
 Authorization: token (TODO : not now)
No body

Response
```json
{
        "exam_id": 1,
        "exam_name": "test",....etc(data of exam)
        "questions": [

                        "question_id": 1,
                        "question_text": "test",....etc(data of questions)
                        "choices": [
                                {
                                        "choice_id": 1,
                                        "choice_text": "test"
                                },
                                {
                                        "choice_id": 2,
                                        "choice_text": "test"
                                }
                                ]


        ],


        }
}
````

### Submit all exam

```bash
Request
        POST /exams/submit_exam?exam_id=1
```

Request

```json
 Header
authorization: exam token (TODO : not now)

body :
{
        "exam_id": 1,
        "student_id": 1,
        "answers": [
                {
                        "question_id": 1,
                        "choice_id": 1
                },
                {
                        "question_id": 2,
                        "choice_id": 2
                }
                ]


        }

```

Response

```json

On Success
{
        "status": "OK",
        "message": "Exam submitted successfully",
        "exam_id": 1,
        "student_id": 1,
        "score": 2
        "total_questions": 10,
        "total_correct": 2,
        "total_incorrect": 8,
        "total_unanswered": 0
        "total_answered": 10
}

On Failiure
{
        "status": "FAIL",
        "message": "Exam not found"
}
```

### submit single question

```bash
Request
        POST /exams/submit_question?exam_id=1
```

Request

```json
 Header
 Authorization: exam token (TODO : not now)

body :
{
        "exam_id": 1,
        "student_id": 1,
        "question_id": 1,
        "choice_id": 1
}
```

Response

```json

On Success
{
        "status": "OK",
        "message": "Question submitted successfully",
        "exam_id": 1,
        "student_id": 1,
        "question_id": 1,
        "choice_id": 1
}

On Failiure
{
        "status": "FAIL",
        "message": "Exam not found"
}
```
