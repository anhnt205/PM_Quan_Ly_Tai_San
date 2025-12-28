const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { Op, where, or } = require("sequelize");

const Department = require("../db/models").Department;

exports.create = catchAsync(async (req, res, next) => {
  const body = req.body;
  const newDepartment = await Department.create({
    Id: body.Id,
    DepartmentName: body.DepartmentName,
    IsStore: body.IsStore,
    WarehouseType: body.WarehouseType,
    IsLeader: body.IsLeader,
  });

  return res.json({
    status: "success",
    message: "Tạo phòng ban thành công",
    data: newDepartment,
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const body = req.body;
  const id = req.params.id;
  const department = await Department.findByPk(id);

  if (!department) {
    return next(new AppError("Không tìm thấy phòng ban", 404));
  }
  await department.update(body);

  return res.json({
    status: "success",
    message: "Sửa phòng ban thành công",
  });
});

exports.deleteOne = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const department = await Department.findByPk(id);

  if (!department) {
    return next(new AppError("Không tìm thấy phòng ban", 404));
  }
  await department.destroy();

  return res.json({
    status: "success",
    message: "Xóa phòng ban thành công",
  });
});

exports.deleteMany = catchAsync(async (req, res, next) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return next(new AppError("Vui lòng cung cấp danh sách ID cần xóa", 400));
  }

  const deletedCount = await Department.destroy({
    where: {
      Id: {
        [Op.in]: ids,
      },
    },
  });

  if (deletedCount === 0) {
    return next(new AppError("Không tìm thấy phòng ban nào để xóa", 404));
  }

  return res.json({
    status: "success",
    message: `Đã xóa thành công ${deletedCount} phòng ban`,
  });
});

exports.getAll = catchAsync(async (req, res, next) => {
  const { q } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9999999;
  const offset = (page - 1) * limit;

  let whereCondition = {};

  if (q) {
    whereCondition = {
      [Op.or]: [
        { Id: { [Op.like]: `%${q}%` } },
        { DepartmentName: { [Op.like]: `%${q}%` } },
      ],
    };
  }
  // 2. Gọi hàm lấy dữ liệu có truyền tham số phân trang
  const { rows, count } = await Department.findAndCountAll({
    where: whereCondition,
    limit: limit,
    offset: offset,
  });

  return res.json({
    status: "success",
    message: "Lấy danh sách phòng ban thành công",
    data: {
      items: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      limit: limit,
    },
  });
});
