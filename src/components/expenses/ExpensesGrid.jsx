import React, { useContext, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import { removeExpense } from "../user/UserUtils";
import { UserContext } from "../../App";
import Box from "@mui/material/Box";
import currency from "currency.js";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const ExpensesGrid = () => {
  const userContext = useContext(UserContext);
  const { users, setUsers, setEditId } = userContext;
  const [hoveredRow, setHoveredRow] = useState(null);

  const columns = [
    {
      field: "fullName",
      headerClassName: "text-violet-600 h-12 min-h-12",
      headerName: "Full name",
      width: 150,
    },
    {
      field: "category",
      headerClassName: "text-violet-600 h-12 min-h-12",
      headerName: "Category",
      width: 150,
    },
    {
      field: "description",
      headerClassName: "text-violet-600 h-12 min-h-12",
      headerName: "Description",
      width: 150,
    },
    {
      field: "cost",
      headerClassName: "text-violet-600 h-12 min-h-12",
      headerName: "Cost",
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
      width: 70,
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
              <IconButton onClick={() => handleEditUser(params.id)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleRemoveExpense(params.id)}>
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
      if (!value.expenses || value.expenses.length === 0) {
        continue;
      }
      value.expenses.forEach((expense, index) => {
        result.push({
          category: expense.category,
          description: expense.description,
          cost: expense.cost,
          id: `${value.id}~${index}`,
          lastName: value.lastName,
          firstName: value.firstName,
          fullName: value.fullName,
          totalExpense: value.totalExpense,
          expenses: value.expenses,
        });
      });
    }
    return result;
  }, [users]);

  const handleEditUser = (id) => {
    setEditId(id);
  };

  const onMouseEnterRow = (event) => {
    const id = event.currentTarget.getAttribute("data-id");
    setHoveredRow(id);
  };

  const onMouseLeaveRow = (event) => {
    setHoveredRow(null);
  };

  const handleRemoveExpense = (id) => {
    const ids = id.split("~");
    const userId = ids[0];
    const expenseIndex = ids[1];
    const newUsers = removeExpense(Number(userId), Number(expenseIndex));
    setUsers((prevUsers) => ({ ...prevUsers, rows: newUsers }));
  };

  return (
    <div className="scale-90 origin-top-left">
      <Box
        sx={{
          height: 370,
          width: 625,
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

export default ExpensesGrid;
