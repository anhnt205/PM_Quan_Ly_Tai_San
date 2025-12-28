const router = require("express").Router();
const departmentController = require("../controller/department");

router.post("/create", departmentController.create);
router.put("/update/:id", departmentController.update);
router.delete("/deleteOne/:id", departmentController.deleteOne);
router.post("/deleteMany", departmentController.deleteMany);
router.get("/getAll", departmentController.getAll);

module.exports = router;
