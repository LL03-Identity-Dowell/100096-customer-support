import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

const columns = [
  {
    id: "sl",
    label: "sl",
    minWidth: 170,
  },

  {
    id: "name",
    label: "name",
    minWidth: 100,
  },
  {
    id: "assigned_role",
    label: "assigned_role",
    minWidth: 170,
    align: "right",
    // format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "server",
    label: "server",
    minWidth: 170,
    align: "right",
    // format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "channel",
    label: "channel",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "action",
    label: "action",
    minWidth: 170,
    align: "right",
    // format: (value) => value.toFixed(2),
  },
];

function createData(sl, name, assigned_role, server, channel, action) {
  // const density = population / size;
  return { sl, name, assigned_role, server, channel, action };
}

const rows = [
  createData(
    1,
    "Thomas Managing Director",
    "Super admin",
    3287263,
    45,
    "no acttion"
  ),
  createData(
    2,
    "Manish - Project Lead",
    "No Role assgined",
    9596961,
    45,
    "no acttion"
  ),
  createData(3, "HR - ZOYA", "No role assigned", 301340, 45, "no acttion"),
  createData(4, "Manging Director", "Viewer", 9833520, 45, "no acttion"),
  createData(5, "HRTR - KHALA", "No role assigned", 9984670, 45, "no acttion"),
  createData(6, "AU", "No role assigned", 7692024, 45, "no acttion"),
  createData(7, "DE", "Viewer", 357578, 45, "no acttion"),
  createData(8, "IE", "No role assigned", 70273, 45, "no acttion"),
  createData(9, "MX", "Viewer", 1972550, 45, "no acttion"),
  createData(10, "JP", "No role assigned", 377973, 45, "no acttion"),
  createData(11, "FR", "Viewer", 640679, 45, "no acttion"),
  createData(12, "United", "No role assigned", 242495, 45, "no acttion"),
  createData(13, "RU", "No role assigned", 17098246, 45, "no acttion"),
  createData(14, "NG", "Viewer", 923768, 45, "no acttion"),
  createData(15, "BR", "No role assigned", 8515767, 45, "no acttion"),
];

export default function Settings({
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
}) {
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
