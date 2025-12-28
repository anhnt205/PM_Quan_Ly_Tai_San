import * as yup from 'yup'

export const DepartmentValidation = yup.object({
    Id: yup.string().required('Bắt buộc'),
    DepartmentName: yup.string().required('Bắt buộc'),
})