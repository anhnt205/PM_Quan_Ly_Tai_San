import * as yup from 'yup'

export const StaffValidation = yup.object({
    code: yup.string().required('Bắt buộc'),
    name: yup.string().required('Bắt buộc'),
    phone: yup.string().required('Bắt buộc'),
    email: yup.string().required('Bắt buộc'),
    department: yup.string().required('Bắt buộc'),
    position: yup.string().required('Bắt buộc'),
})