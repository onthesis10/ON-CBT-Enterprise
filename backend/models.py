from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean, Enum, Table
from sqlalchemy.orm import relationship
from database import Base
import datetime
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    TEACHER = "guru"
    STUDENT = "siswa"

exam_class_assoc = Table(
    'exam_class_assoc', Base.metadata,
    Column('exam_id', Integer, ForeignKey('exams.id')),
    Column('classroom_id', Integer, ForeignKey('classrooms.id'))
)

class School(Base):
    __tablename__ = "schools"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    code = Column(String, unique=True, index=True)
    logo = Column(String, nullable=True) 
    
    users = relationship("User", back_populates="school")
    exams = relationship("Exam", back_populates="school")
    classrooms = relationship("Classroom", back_populates="school")

class Classroom(Base):
    __tablename__ = "classrooms"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    school_id = Column(Integer, ForeignKey("schools.id"))
    
    school = relationship("School", back_populates="classrooms")
    students = relationship("User", back_populates="classroom")
    exams = relationship("Exam", secondary=exam_class_assoc, back_populates="classrooms")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    role = Column(String, default=UserRole.STUDENT)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    nisn = Column(String, nullable=True, index=True)
    exam_number = Column(String, nullable=True) 
    gender = Column(String, nullable=True) 
    original_password = Column(String, nullable=True)
    
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=True)
    school = relationship("School", back_populates="users")
    
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=True)
    classroom = relationship("Classroom", back_populates="students")

class Exam(Base):
    __tablename__ = "exams"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    duration_minutes = Column(Integer, default=60)
    start_time = Column(DateTime, nullable=True)
    end_time = Column(DateTime, nullable=True)
    token = Column(String, nullable=True)
    is_active = Column(Boolean, default=False)
    created_by = Column(Integer, ForeignKey("users.id"))
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=True)
    
    school = relationship("School", back_populates="exams")
    questions = relationship("Question", back_populates="exam")
    classrooms = relationship("Classroom", secondary=exam_class_assoc, back_populates="exams")

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id"))
    content = Column(Text)
    question_type = Column(String, default="multiple_choice")
    options = Column(Text, nullable=True) 
    correct_answer = Column(String)
    score = Column(Integer, default=1)
    exam = relationship("Exam", back_populates="questions")

class ExamResult(Base):
    __tablename__ = "exam_results"
    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id"))
    student_id = Column(Integer, ForeignKey("users.id"))
    score = Column(Integer)
    answers = Column(Text) 
    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # [BARU] Tambahan Waktu (dalam menit)
    extra_minutes = Column(Integer, default=0)

    exam = relationship("Exam")
    student = relationship("User")