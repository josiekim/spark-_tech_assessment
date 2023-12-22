import React, { FC, useState, useMemo } from "react";
import { StudentFinalGrade } from "../types/api_types";
import { CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from "@mui/material";

export function dummyData(): StudentFinalGrade[] {
  return [];
}

interface GradeTableProps {
  studentFinalGrades: StudentFinalGrade[];
  loading: boolean;
}

export const GradeTable: FC<GradeTableProps> = ({ studentFinalGrades, loading }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Memoize the table rows for better performance
  const tableRows = useMemo(() => {
    return studentFinalGrades.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
      <TableRow key={index}>
        <TableCell>{item.student.universityId}</TableCell>
        <TableCell>{item.student.name}</TableCell>
        <TableCell>{item.class.classId}</TableCell>
        <TableCell>{item.class.title}</TableCell>
        <TableCell>{item.class.semester}</TableCell>
        <TableCell>{item.finalGrade.toFixed(2)}</TableCell>
      </TableRow>
    ));
  }, [studentFinalGrades, page, rowsPerPage]);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - studentFinalGrades.length) : 0;

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Student ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Class ID</TableCell>
            <TableCell>Class Name</TableCell>
            <TableCell>Semester</TableCell>
            <TableCell>Final Grade</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} style={{ textAlign: 'center' }}>
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : (
            tableRows
          )}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={studentFinalGrades.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};
