import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import PageAction from "../../components/common/PageAction";
import { useDinhMucSuaChuaPageQuery, useDinhMucSuaChuaMutation } from "./Mutation";
import { useDebounce } from "../../hooks/useDebounce";
import RepairNormForm from "./components/RepairNormForm";
import RepairNormTableCustom, { ColumnConfig } from "./components/RepairNormTableCustom";
import { DinhMucSuaChua } from "./types";
import { showConfirmAlert } from "../../components/Alert";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function RepairNorm() {
  const { user } = useSelector((state: RootState) => state.user);
  const [searchValue, setSearchValue] = useState("");
  const searchDebounce = useDebounce(searchValue, 600);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const { data: pageData, isLoading } = useDinhMucSuaChuaPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce
  );
  const { createMutation, updateMutation, deleteMutation } = useDinhMucSuaChuaMutation();

  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<DinhMucSuaChua | null>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleEdit = (row: DinhMucSuaChua) => {
    setEditData(row);
    setReadOnly(true);
    setShowForm(true);
    window.scrollTo({ top: 140, behavior: "smooth" });
  };

  const handleSave = (values: DinhMucSuaChua) => {
    const username = user?.taiKhoan?.tenDangNhap || "admin";
    if (editData && editData.id) {
      updateMutation.mutate({ id: editData.id, dto: values, username });
    } else {
      createMutation.mutate({ dto: values, username });
    }
    setShowForm(false);
    setEditData(null);
    setReadOnly(false);
  };

  const handleDelete = async (id: string) => {
    const confirm = await showConfirmAlert("Bạn có chắc chắn muốn xóa định mức này?");
    if (confirm.isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  const handleDeleteMany = async (ids: string[]) => {
      const confirm = await showConfirmAlert(`Xác nhận xóa ${ids.length} bản ghi?`);
      if (confirm.isConfirmed) {
          // Hiện tại mutation chỉ có delete single, gọi loop hoặc cập nhật mutation
          for (const id of ids) {
              await deleteMutation.mutateAsync(id);
          }
          setSelectedIds([]);
      }
  };

  const [columns, setColumns] = useState<ColumnConfig[]>([
    {
      key: "tenLoaiSuaChua",
      label: "Loại sửa chữa",
      width: 250,
    },
    {
      key: "ghiChu",
      label: "Ghi chú",
      width: 300,
    },
    {
      key: "actions",
      label: "Thao tác",
      width: 120,
      align: "center",
      render: (_, row) => (
        <Box display="flex" gap={1} justifyContent="center" onClick={(e) => e.stopPropagation()}>
          <IconButton color="primary" onClick={() => handleEdit(row)} size="small">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(row.id)} size="small">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ]);

  return (
    <Box sx={{ width: "100%" }}>
      <PageAction
        title="Định mức sửa chữa"
        onNewClick={() => {
          setEditData(null);
          setReadOnly(false);
          setShowForm(true);
        }}
      />

      <Box p={2}>
        {showForm && (
          <Box py={2}>
            <RepairNormForm
              key={editData ? editData.id : "new-norm"}
              onCancel={() => {
                setShowForm(false);
                setEditData(null);
                setReadOnly(false);
              }}
              onEdit={() => setReadOnly(false)}
              onSave={handleSave}
              editData={editData}
              readOnly={readOnly}
            />
          </Box>
        )}

        <RepairNormTableCustom
          tableId="repairNormTable"
          title="Định mức sửa chữa"
          rows={pageData?.items || []}
          total={pageData?.totalItems || 0}
          columns={columns}
          onColumnsChange={setColumns}
          loading={isLoading}
          onRowClick={handleEdit}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onDelete={handleDeleteMany}
        />
      </Box>
    </Box>
  );
}
