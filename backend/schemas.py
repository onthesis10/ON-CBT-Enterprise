from pydantic import BaseModel
from typing import Optional, List, Any
from models import UserRole
import datetime

# --- CLASSROOM ---
class ClassroomBase(BaseModel):
    name: str
class ClassroomCreate(ClassroomBase): pass
class ClassroomResponse(ClassroomBase):
    id: int
    school_id: int
    class Config: from_attributes = True

# --- SCHOOL ---
class SchoolCreate(BaseModel):
    name: str
    code: str
    logo: Optional[str] = None
class SchoolResponse(SchoolCreate):
    id: int
    classrooms: List[ClassroomResponse] = []
    class Config: from_attributes = True

# --- USER ---
class UserBase(BaseModel):
    username: str
    full_name: str
    role: UserRole = UserRole.STUDENT
class UserCreate(UserBase):
    password: str
    school_code: str
    classroom_id: Optional[int] = None
class UserResponse(UserBase):
    id: int
    is_active: bool
    school_id: Optional[int] = None
    classroom: Optional[ClassroomResponse] = None
    school: Optional[SchoolResponse] = None
    nisn: Optional[str] = None
    exam_number: Optional[str] = None
    gender: Optional[str] = None
    original_password: Optional[str] = None
    class Config: from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
class LoginRequest(BaseModel):
    username: str
    password: str

# --- UJIAN & SOAL ---
class QuestionBase(BaseModel):
    content: str
    question_type: str = "multiple_choice"
    options: Optional[str] = None
    correct_answer: Optional[str] = None
    score: int = 10
class QuestionCreate(QuestionBase): pass
class QuestionResponse(QuestionBase):
    id: int
    exam_id: int
    class Config: from_attributes = True

class ExamBase(BaseModel):
    title: str
    description: Optional[str] = None
    duration_minutes: int = 60
    start_time: Optional[datetime.datetime] = None
    end_time: Optional[datetime.datetime] = None
class ExamCreate(ExamBase):
    classroom_ids: List[int] = []
class ExamResponse(ExamBase):
    id: int
    is_active: bool
    created_by: int
    classrooms: List[ClassroomResponse] = []
    questions: List[QuestionResponse] = []
    class Config: from_attributes = True

class GenerateRequest(BaseModel):
    topic: str
    count: int = 5
class AnswerSubmit(BaseModel):
    answers: dict[str, Any]

class ExamResultResponse(BaseModel):
    id: int
    score: int
    submitted_at: datetime.datetime
    class Config: from_attributes = True

class ExamResultWithStudent(ExamResultResponse):
    student: UserResponse 

class ExamResultWithExam(ExamResultResponse):
    exam: ExamResponse

# --- [BARU] SCHEMA KOMPLIT UNTUK HALAMAN KOREKSI ---
class ScoreUpdate(BaseModel):
    score: int

class ExamResultDetail(ExamResultResponse):
    student: UserResponse
    exam: ExamResponse # <-- INI KUNCINYA BIAR DATA UJIAN KEBAWA