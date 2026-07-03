import * as yup from 'yup'

export const DepartmentValidation = yup.object({
    id: yup.string().required('Bắt buộc'),
    tenPhongBan: yup.string().required('Bắt buộc'),
})