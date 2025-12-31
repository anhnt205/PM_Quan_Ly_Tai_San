import * as yup from 'yup'

export const ProjectValidation = yup.object({
    id: yup.string().required('Bắt buộc'),
    tenDuAn: yup.string().required('Bắt buộc'),
})