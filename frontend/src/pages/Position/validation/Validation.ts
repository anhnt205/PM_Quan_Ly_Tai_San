import * as yup from 'yup'

export const PositionValidation = yup.object({
    id: yup.string().required('Bắt buộc'),
    tenChucVu: yup.string().required('Bắt buộc'),
})