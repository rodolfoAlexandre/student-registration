import { Student } from '../models/Student'
import { Op } from 'sequelize'

export const studentService = {

    findAllPaginated: async (page: number, perPage: number, search : string) => {
        const offset = (page - 1) * perPage

        if (!search) {

            const { count, rows } = await Student.findAndCountAll({
                order: [['createdAt', 'DESC']],
                limit: perPage,
                offset
            })

            return {
                students: rows,
                page,
                perPage,
                total: count
            }            
        }
        else {

            const { count, rows } = await Student.findAndCountAll({
                where: {
                    [Op.or] : [
                        {
                            name: {
                                [Op.iLike]: `%${search}%`
                            }
                        },
                        {
                            email: {
                                [Op.iLike]: `%${search}%`
                            }
                        },
                        {
                            cpf: {
                                [Op.iLike]: `%${search}%`
                            }
                        },
                        {
                            academic_record: {
                                [Op.iLike]: `%${search}%`
                            }
                        }
                    ]
                },
                order: [['createdAt', 'DESC']],
                limit: perPage,
                offset
            })

            return {
                students: rows,
                page,
                perPage,
                total: count
            }            

        }


    },

    findByCPF: async (cpf: string) => {

        const student = await Student.findByPk(cpf);
        return student
    },

    create: async (name: string, email: string, academic_record: string, cpf: string) => {

        const student = await Student.create({
            name,
            email,
            academic_record,
            cpf
        })
        return student

    },

    update: async (name: string, email: string, cpf: string) => {

        const student = await studentService.findByCPF(cpf)

        if (student) {

            student.name = name
            student.email = email
            await student.save()
        }

        return student

    },

    delete: async (cpf: string) => {
        await Student.destroy({
            where: { cpf }
        })
    }

}