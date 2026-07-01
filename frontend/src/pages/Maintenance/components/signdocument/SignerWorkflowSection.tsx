import { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { getIn } from "formik";
import { useAllDepartmentsQuery } from "../../../Department/Mutation";
import { useAllStaffsQuery } from "../../../Staff/Mutation";
import FieldAutoCompleted from "../../../../components/TextField/FieldAutoCompleted";

interface SignerWorkflowSectionProps {
  formik: any;
  fieldName?: string; // defaults to "nguoiKyList"
}

type SimpleDept = { id: string; name: string };
type SimpleUser = {
  id: string;
  name: string;
  departmentId?: string;
  title?: string;
};

export default function SignerWorkflowSection({
  formik,
  fieldName = "nguoiKyList",
}: SignerWorkflowSectionProps) {
  const { data: apiDepartments = [] } = useAllDepartmentsQuery();
  const { data: apiUsers = [] } = useAllStaffsQuery();

  const [addDeptId, setAddDeptId] = useState("");
  const [addUserId, setAddUserId] = useState("");
  const [editingSignerId, setEditingSignerId] = useState<string | null>(null);
  const [editDeptId, setEditDeptId] = useState("");
  const [editUserId, setEditUserId] = useState("");

  const departments: SimpleDept[] = (apiDepartments || []).map((d: any) => ({
    id: String(d?.id ?? ""),
    name: String(d?.tenPhongBan ?? d?.name ?? ""),
  }));

  const users: SimpleUser[] = (apiUsers || [])
    .filter((u: any) => u.hasAccount)
    .map((u: any) => ({
      id: String(u?.id ?? ""),
      name: String(u?.hoTen ?? u?.name ?? ""),
      departmentId: String(u?.phongBanId ?? u?.departmentId ?? ""),
      title: String(u?.tenChucVu ?? u?.chucVu ?? u?.title ?? ""),
    }));

  const signers = getIn(formik.values, fieldName) || [];

  const handleAddSigner = () => {
    if (!addUserId || !addDeptId) return;
    if (signers.some((s: any) => s.userId === addUserId)) return;
    const user = users.find((u) => u.id === addUserId);
    const dept = departments.find((d) => d.id === addDeptId);
    if (!user || !dept) return;

    const updated = [
      ...signers,
      {
        userId: user.id,
        userName: user.name,
        departmentId: dept.id,
        departmentName: dept.name,
        position: user.title ?? "",
        order: signers.length + 1,
        signed: false,
      },
    ];
    formik.setFieldValue(fieldName, updated);
    setAddDeptId("");
    setAddUserId("");
  };

  const handleRemoveSigner = (userId: string) => {
    const updated = signers
      .filter((s: any) => s.userId !== userId)
      .map((s: any, i: number) => ({ ...s, order: i + 1 }));
    formik.setFieldValue(fieldName, updated);
  };

  const handleEdit = (signer: any) => {
    setEditingSignerId(signer.userId);
    setEditDeptId(signer.departmentId);
    setEditUserId(signer.userId);
  };

  const handleSaveEdit = () => {
    const updated = signers.map((s: any) =>
      s.userId === editingSignerId
        ? {
            ...s,
            userId: editUserId,
            userName: users.find((u) => u.id === editUserId)?.name || "",
            departmentId: editDeptId,
            position: users.find((u) => u.id === editUserId)?.title || "",
            departmentName:
              departments.find((d) => d.id === editDeptId)?.name || "",
          }
        : s,
    );
    formik.setFieldValue(fieldName, updated);
    setEditingSignerId(null);
  };

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight={600}
        mb={2}
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        Quy trình duyệt
        <Chip
          label={`${signers.length} người`}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 400 }}
        />
      </Typography>

      <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
        {signers.length > 0 ? (
          <Box sx={{ position: "relative", pl: 5 }}>
            <Box
              sx={{
                position: "absolute",
                left: 16,
                top: 8,
                bottom: 8,
                width: "1px",
                bgcolor: "divider",
              }}
            />
            {signers.map((s: any, idx: number) => {
              const user = users.find((u) => u.id === s.userId);
              const isEditingThis = editingSignerId === s.userId;
              return (
                <Box key={s.userId} sx={{ position: "relative", mb: 1.5 }}>
                  <Box
                    sx={{
                      position: "absolute",
                      left: -37,
                      top: 14,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 600,
                      zIndex: 1,
                      boxShadow: "0 0 0 3px white",
                    }}
                  >
                    {idx + 1}
                  </Box>

                  <Box
                    sx={{
                      border: "1px solid",
                      borderColor: isEditingThis ? "primary.main" : "divider",
                      borderRadius: 2,
                      p: 1.5,
                      bgcolor: isEditingThis
                        ? "primary.50"
                        : "background.paper",
                      transition: "all 0.2s",
                      "&:hover": !isEditingThis
                        ? { boxShadow: 1, borderColor: "grey.300" }
                        : {},
                    }}
                  >
                    {isEditingThis ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1.5,
                        }}
                      >
                        <FieldAutoCompleted
                          title="Phòng ban"
                          data={departments}
                          labelkey="name"
                          value={editDeptId}
                          onChange={(e) => {
                            setEditDeptId(e ? e.id : "");
                            setEditUserId("");
                          }}
                        />
                        <FieldAutoCompleted
                          title="Người duyệt"
                          data={users.filter(
                            (u) => u.departmentId === editDeptId,
                          )}
                          labelkey="name"
                          value={editUserId}
                          onChange={(e) => {
                            setEditUserId(e ? e.id : "");
                          }}
                        />
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={handleSaveEdit}
                          >
                            Lưu
                          </Button>
                          <Button
                            size="small"
                            onClick={() => setEditingSignerId(null)}
                          >
                            Hủy
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              bgcolor: "primary.main",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 600,
                              fontSize: 13,
                              flexShrink: 0,
                            }}
                          >
                            {(user?.name || s.userName)?.charAt(0) ?? "?"}
                          </Box>
                          <Box>
                            <Typography fontWeight={600} fontSize={13}>
                              {user?.name || s.userName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {user?.title || s.position || "Cán bộ"}
                            </Typography>
                            <Box sx={{ mt: 0.5 }}>
                              <Chip
                                label={
                                  departments.find(
                                    (d) => d.id === s.departmentId,
                                  )?.name || s.departmentName
                                }
                                size="small"
                                sx={{
                                  fontSize: 10,
                                  height: 18,
                                  bgcolor: "grey.100",
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleEdit(s)}
                          >
                            Sửa
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            onClick={() => handleRemoveSigner(s.userId)}
                          >
                            Xóa
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        ) : (
          <Alert severity="info" sx={{ mb: 2 }}>
            Chưa có người duyệt
          </Alert>
        )}
      </Box>

      {/* Form thêm người duyệt */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          p: 2,
          bgcolor: "grey.50",
          borderRadius: 2,
          border: "1px dashed",
          borderColor: "divider",
        }}
      >
        <FieldAutoCompleted
          title="Phòng ban"
          data={departments}
          labelkey="name"
          value={addDeptId}
          onChange={(e) => {
            setAddDeptId(e ? e.id : "");
            setAddUserId("");
          }}
        />

        <FieldAutoCompleted
          title="Người duyệt"
          data={users.filter(
            (u) =>
              u.departmentId === addDeptId &&
              !signers.some((s: any) => s.userId === u.id),
          )}
          labelkey="name"
          value={addUserId}
          onChange={(e) => {
            setAddUserId(e ? e.id : "");
          }}
        />

        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={handleAddSigner}
          disabled={!addUserId}
          fullWidth
        >
          Thêm người duyệt
        </Button>
      </Box>
    </Box>
  );
}
