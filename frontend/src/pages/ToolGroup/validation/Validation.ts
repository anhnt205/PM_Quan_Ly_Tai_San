import * as yup from 'yup'

export const ToolGroupValidation = yup.object({
    code: yup.string().required('Bắt buộc'),
    name: yup.string().required('Bắt buộc'),
})