import * as yup from 'yup'

export const CapitalSourceValidation = yup.object({
    id: yup.string().required('Bắt buộc'),
    tenNguonKinhPhi: yup.string().required('Bắt buộc'),
})