import Swal from "sweetalert2";

export const showSuccessAlert = (message = "Lưu thành công") => {
  return Swal.fire({
    title: "Thành công!",
    text: message,
    icon: "success",
    confirmButtonText: "Đồng ý",
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
};

export const showErrorAlert = (message = "Đã xảy ra lỗi.") => {
  return Swal.fire({
    title: "Lỗi!",
    text: message,
    icon: "error",
    confirmButtonText: "Đóng",
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
};

export const showConfirmAlert = (message = "Bạn có chắc chắn không?") => {
  return Swal.fire({
    title: "Xác nhận",
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Đồng ý",
    cancelButtonText: "Hủy",
  });
};

export const confirmPin = async (): Promise<string | null> => {
  const { value } = await Swal.fire({
    title: "Xác nhận mã Pin",
    html: `
      <p style="margin-bottom:16px;color:#666">
        Vui lòng nhập mã Pin để xác nhận
      </p>

      <div style="position:relative">
        <input
          id="swal-pin"
          type="password"
          class="swal2-input"
          placeholder="Nhập mã Pin"
          style="padding-right:40px"
        />
        <span
          id="toggle-pin"
          style="
            position:absolute;
            right:14px;
            top:50%;
            transform:translateY(-50%);
            cursor:pointer;
            color:#555;
          "
        >
          👁️
        </span>
      </div>
    `,
    showCancelButton: true,
    cancelButtonText: "HỦY",
    confirmButtonText: "XÁC NHẬN",
    confirmButtonColor: "#1976d2",
    focusConfirm: false,

    didOpen: () => {
      const pinInput = document.getElementById("swal-pin") as HTMLInputElement;

      const toggle = document.getElementById("toggle-pin");

      toggle?.addEventListener("click", () => {
        pinInput.type = pinInput.type === "password" ? "text" : "password";
      });
    },

    preConfirm: () => {
      const pin = (document.getElementById("swal-pin") as HTMLInputElement)
        .value;

      if (!pin) {
        Swal.showValidationMessage("Vui lòng nhập mã Pin");
        return;
      }

      return pin;
    },
  });

  return value ?? null;
};

export const showTabLimitAlert = () => {
  return Swal.fire({
    title: "Đã đạt giới hạn tab!",
    text: "Bạn đang mở tối đa 7 tabs. Vui lòng đóng bớt tab trước khi mở tab mới.",
    icon: "warning",
    confirmButtonText: "Đã hiểu",
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
};
