import React, { useCallback, useContext, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { UserContext } from "../../App";
import Box from "@mui/material/Box";
import currency from "currency.js";

const CompanyExpensesGrid = () => {
  const userContext = useContext(UserContext);
  const { users } = userContext;

  const columns = [
    {
      field: "category",
      headerClassName: "text-violet-600 h-12 min-h-12",
      headerName: "Category",
      width: 150,
    },
    {
      field: "totalExpense",
      headerClassName: "text-violet-600 h-12 min-h-12",
      headerName: "Total Expenses",
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
    },
  ];

  const sum = useCallback((values) => {
    return values.reduce(function (previousValue, currentValue) {
      return Number(previousValue) + Number(currentValue);
    });
  }, []);

  const rowData = useMemo(() => {
    const result = [];
    const foodExpenses = [];
    const travelExpenses = [];
    const equipmentExpenses = [];
    for (const [key, value] of users.rows) {
      if (value.expenses) {
        value.expenses.forEach((expense) => {
          if (expense.category === "Food") {
            foodExpenses.push(expense.cost);
          }
          if (expense.category === "Travel") {
            travelExpenses.push(expense.cost);
          }
          if (expense.category === "Equipment") {
            equipmentExpenses.push(expense.cost);
          }
        });
      }
    }
    result.push({
      id: 1,
      category: "Food",
      totalExpense: foodExpenses.length > 0 ? sum(foodExpenses) : 0,
    });
    result.push({
      id: 2,
      category: "Travel",
      totalExpense: travelExpenses.length > 0 ? sum(travelExpenses) : 0,
    });
    result.push({
      id: 3,
      category: "Equipment",
      totalExpense: equipmentExpenses.length > 0 ? sum(equipmentExpenses) : 0,
    });
    return result;
  }, [users]);

  return (
    <div className="scale-90 origin-top-left">
      <Box
        sx={{
          height: 370,
          width: 305,
          background: "#FFFFFF",
          borderRadius: "1rem",
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={rowData}
          columns={columns}
          rowsPerPageOptions={[3]}
          experimentalFeatures={{ newEditingApi: true }}
          initialState={{ pinnedColumns: { right: ["actions"] } }}
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

export default CompanyExpensesGrid;
