import { Request, Response, NextFunction } from 'express';
import { getPaginationParams } from '../helpers/getPaginationParams';
import { studentService } from '../services/studentService';

export const studentsController = {

    index: async (req: Request, res: Response, next: NextFunction) => {

        const [page, perPage] = getPaginationParams(req.query)

        try {

            const students = await studentService.findAllPaginated(page, perPage);
            return res.json(students)

        } catch (error) {
            next(error)
        }
    },

    show: async (req: Request, res: Response, next: NextFunction) => {

        const { cpf } = req.params;

        try {

            const student = await studentService.findByCPF(cpf)

            if (student)
                return res.json(student)
            else
                throw new Error("Student not found");

        } catch (error) {
            next(error)
        }
    },

    save: async (req: Request, res: Response, next: NextFunction) => {

        const { name, email, academic_record, cpf } = req.body;

        try {

            const student = await studentService.create(name, email, academic_record, cpf)
            return res.status(201).json(student)

        } catch (error) {
            next(error)
        }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
        const { name, email } = req.body;
        const { cpf } = req.params;

        try {

            const student = await studentService.update(name, email, cpf)

            if (!student)
                throw new Error("Student not found");

            return res.status(200).json(student)

        } catch (error) {
            next(error)
        }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
        const { cpf } = req.params;

        try {

            const student = await studentService.findByCPF(cpf)

            if (!student)
                throw new Error("Student not found");

            await studentService.delete(cpf)
            return res.status(204).send()

        } catch (error) {
            next(error)
        }
    }
}