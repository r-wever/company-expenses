import React, { useContext, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import { removeUser, updateUser } from "./UserUtils";
import { UserContext } from "../../App";
import Box from "@mui/material/Box";
import currency from "currency.js";
import DeleteIcon from "@mui/icons-material/Delete";

const UsersGrid = () => {
  const userContext = useContext(UserContext);
  const { users, setUsers } = userContext;
  const [hoveredRow, setHoveredRow] = useState(null);

  const columns = [
    {
      field: "firstName",
      headerClassName: "text-violet-600 h-12 min-h-12",
      headerName: "First name",
      width: 150,
      editable: true,
    },
    {
      field: "lastName",
      headerClassName: "text-violet-600 h-12 min-h-12",
      headerName: "Last name",
      width: 150,
      editable: true,
    },
    {
      field: "totalExpense",
      headerClassName: "text-violet-600 h-12 min-h-12",
      headerName: "Total Expense",
      align: "center",
      width: 100,
      editable: false,
      valueFormatter: (params) => {
        if (params.value == null) {
          return "";
        }
        const valueFormatted = currency(params.value, {
          decimal: ".",
        }).format();
        return `${valueFormatted}`;
      },
    },
    {
      field: "actions",
      headerName: "",
      width: 2,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        if (hoveredRow === params.id) {
          return (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IconButton onClick={() => handleRemoveUser(params.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          );
        } else return null;
      },
    },
  ];

  const rowData = useMemo(() => {
    const result = [];
    for (const [key, value] of users.rows) {
      result.push(value);
    }
    return result;
  }, [users]);

  const onMouseEnterRow = (event) => {
    const id = Number(event.currentTarget.getAttribute("data-id"));
    setHoveredRow(id);
  };

  const onMouseLeaveRow = (event) => {
    setHoveredRow(null);
  };

  const handleNameEdit = (params, event) => {
    const oldName = params.value;
    const newName = event.target.value;
    if (oldName === newName) return; // no change detected

    updateUser(params.id, params.field, newName);
  };

  const handleRemoveUser = (id) => {
    const newUsers = removeUser(id);
    setUsers((prevUsers) => ({ ...prevUsers, rows: newUsers }));
  };

  return (
    <div className="scale-90 origin-top-left">
      <Box
        sx={{
          height: 371,
          width: 453,
          background: "#FFFFFF",
          borderRadius: "1rem",
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={rowData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          experimentalFeatures={{ newEditingApi: true }}
          initialState={{ pinnedColumns: { right: ["actions"] } }}
          componentsProps={{
            row: {
              onMouseEnter: onMouseEnterRow,
              onMouseLeave: onMouseLeaveRow,
            },
          }}
          onCellEditStop={(params, event) => {
            handleNameEdit(params, event);
          }}
          sx={{
            "& .MuiDataGrid-iconSeparator": {
              display: "none",
            },
            "& .MuiDataGrid-pinnedColumnHeaders": {
              boxShadow: "none",
              backgroundColor: "transparent",
            },
            "& .MuiDataGrid-pinnedColumns": {
              boxShadow: "none",
              "& .MuiDataGrid-cell": {
                padding: 0,
              },
            },
            "& .MuiDataGrid-row": {
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "whitesmoke",
              },
              "&:first-of-type": {
                borderTop: "1px solid rgba(224, 224, 224, 1)",
              },
            },
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
          }}
        />
      </Box>
    </div>
  );
};
export default UsersGrid;
