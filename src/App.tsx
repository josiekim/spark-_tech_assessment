import{ useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
/**
 * You will find globals from this file useful!
 */
import { BASE_API_URL, GET_DEFAULT_HEADERS, MY_BU_ID } from "./globals";
import { IUniversityClass, StudentFinalGrade } from "./types/api_types";
import { GradeTable } from "./components/GradeTable";
import { calcAllFinalGrade } from "./utils/calculate_grade";

function App() {
  // You will need to use more of these!
  const [currClass, setCurrClass] = useState<IUniversityClass | null>(null);
  const [classList, setClassList] = useState<IUniversityClass[]>([]);
  const [finalGrades, setFinalGrades] = useState<StudentFinalGrade[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * This is JUST an example of how you might fetch some data(with a different API).
   * As you might notice, this does not show up in your console right now.
   * This is because the function isn't called by anything!
   *
   * You will need to lookup how to fetch data from an API using React.js
   * Something you might want to look at is the useEffect hook.
   *
   * The useEffect hook will be useful for populating the data in the dropdown box.
   * You will want to make sure that the effect is only called once at component mount.
   *
   * You will also need to explore the use of async/await.
   *
   */
  const fetchClassList = async () => {
    const res = await fetch(`${BASE_API_URL}/class/listBySemester/fall2022?buid=${MY_BU_ID}`, {
      method: "GET",
      headers: GET_DEFAULT_HEADERS(), 
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
  
    const json = await res.json();
    setClassList(json);
  };

  const fetchClass = async (classID: string): Promise<IUniversityClass> => {
    console.log("fetchClass", classID);
  
    const res = await fetch(`${BASE_API_URL}/class/GetById/${classID}?buid=${MY_BU_ID}`, {
      method: "GET",
      headers: GET_DEFAULT_HEADERS(),
    }); 
  
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
  
    return res.json();
  }

  useEffect(() => {
    fetchClassList();
  }, []);

  const handleClassSelection = async (event: SelectChangeEvent<string>) => {
    const selectedClassId = event.target.value;
    try {
      setLoading(true);
      const selectedClass = await fetchClass(selectedClassId);
      setCurrClass(selectedClass);

      const grades = await calcAllFinalGrade(selectedClass);
      setFinalGrades(grades);
      setLoading(false);
    } catch (error) {
      console.error("Error in class selection:", error);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Grid container spacing={2} style={{ padding: "1rem" }}>
        <Grid xs={12} container alignItems="center" justifyContent="center">
          <Typography variant="h2" gutterBottom>
            Spark Assessment
          </Typography>
        </Grid>
        <Grid xs={12} md={4}>
          <Typography variant="h4" gutterBottom>
            Select a class
          </Typography>
          <div style={{ width: "100%" }}>
          <Select fullWidth={true} label="Class" value={currClass?.classId || ""} onChange={handleClassSelection}>
              {classList.map((universityClass) => (
                <MenuItem key={universityClass.classId} value={universityClass.classId}>
                {universityClass.title}
              </MenuItem>
              ))}
            </Select>
          </div>
        </Grid>
        <Grid xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            Final Grades
          </Typography>
          <GradeTable studentFinalGrades={finalGrades} loading={loading} />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
