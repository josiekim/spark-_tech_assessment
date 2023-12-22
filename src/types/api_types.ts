/**
 * This file can be used to store types and interfaces for data received from the API.
 * It's good practice to name your interfaces in the following format:
 * IMyInterfaceName - Where the character "I" is prepended to the name of your interface.
 * This helps remove confusion between classes and interfaces.
 */

/**
 * This represents a class as returned by the API
 */
export interface IUniversityClass {
  classId: string;
  title: string;
  description: string;
  meetingTime: string;
  meetingLocation: string;
  status: string;
  semester: string;
}

export interface IAssignment {
  assignmentId: string;   // example: "A123456"
  classId: string;        // example: "C123456"
  date: string;           // example: ($date-time) "2000-01-23T04:56:07+00:00"
  weight: number;
}

export interface IGrade {
  classId: string; // example: "C123"
  grades: Record<string, string>; //example: { "A1": "76", "A2": "88", "A3": "94", "A4": "93", "A5": "88" }
  name: string; // example: "Andrew F. Rosas"
  studentId: string; // example: "S123"
}

export enum StudentStatus {
  ENROLLED = "enrolled",
  GRADUATED = "graduated",
  UNENROLLED = "unenrolled"
}

export interface IStudent {
  dateEnrolled: string; // ($date-time) "2000-01-23T04:56:07+00:00"
  name:	string; // example: "Andrew F. Rosas"
  status: StudentStatus; // example: "enrolled"
  universityId: string; // example: "U1234567"
}

export type StudentFinalGrade = {
  class: IUniversityClass;
  student: IStudent;
  finalGrade: number;
};