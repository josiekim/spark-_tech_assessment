import { IAssignment, IGrade, IStudent, IUniversityClass, StudentStatus } from "../types/api_types";
import { MY_BU_ID, BASE_API_URL, GET_DEFAULT_HEADERS } from "../globals";

async function fetchResource(url: string): Promise<any> {
  const res = await fetch(url, {
    method: "GET",
    headers: GET_DEFAULT_HEADERS(),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json();
}

export const fetchStudentsFromClass = async (classID: string): Promise<string[]> => {
  return fetchResource(`${BASE_API_URL}/class/listStudents/${classID}?buid=${MY_BU_ID}`);
};

export const fetchStudentById = async (studentID: string): Promise<IStudent> => {
  const studentData = await fetchResource(`${BASE_API_URL}/student/GetById/${studentID}?buid=${MY_BU_ID}`);
  return Array.isArray(studentData) ? studentData[0] : studentData;
};

export const fetchAssignments = async (classID: string): Promise<IAssignment[]> => {
  return fetchResource(`${BASE_API_URL}/class/listAssignments/${classID}?buid=${MY_BU_ID}`);
};

export const fetchGrades = async (studentID: string, classID: string): Promise<IGrade> => {
  return fetchResource(`${BASE_API_URL}/student/listGrades/${studentID}/${classID}/?buid=${MY_BU_ID}`);
};

export async function calculateStudentFinalGrade(
  studentGrades: IGrade,
  classAssignments: IAssignment[],
): Promise<number> {
  let weightedSum = 0;
  let totalWeight = 0;

  const gradesObject = studentGrades.grades[0] as Record<string, string>;

  for (const assignment of classAssignments) {
    const gradeStr = gradesObject[assignment.assignmentId];
    const grade = parseFloat(gradeStr || "0");
    const weight = assignment.weight;

    weightedSum += grade * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

export async function calcAllFinalGrade(classInfo: IUniversityClass): Promise<{ class: IUniversityClass, student: IStudent, finalGrade: number }[]> {
  const [students, assignments] = await Promise.all([
    fetchStudentsFromClass(classInfo.classId),
    fetchAssignments(classInfo.classId)
  ]);

  const studentsFinalGradesPromises = students.map(async (studentID: string) => {
    try {
      const [grades, student] = await Promise.all([
        fetchGrades(studentID, classInfo.classId),
        fetchStudentById(studentID)
      ]);
      
      const finalGrade = await calculateStudentFinalGrade(grades, assignments);
      return { class: classInfo, student, finalGrade };
    } catch (error) {
      const dummyStudent: IStudent = {
        dateEnrolled: "N/A",
        name: "Unknown",
        status: StudentStatus.UNENROLLED,
        universityId: "N/A",
      };
      console.error(`Failed to get grades for student ${studentID}:`, error);
      return { class: classInfo, student: dummyStudent, finalGrade: 0 };
    }
  });

  return Promise.all(studentsFinalGradesPromises);
}
