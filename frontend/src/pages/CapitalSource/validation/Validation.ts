import * as yup from 'yup'

export const CapitalSourceValidation = yup.object({
    code: yup.string().required('Bắt buộc'),
    name: yup.string().required('Bắt buộc'),
})