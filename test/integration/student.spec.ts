import { app } from "../../src/app"
import supertest from "supertest"
import { sequelize } from "../../src/database"
import { Student, StudentInstance } from "../../src/models/Student"

describe('Students endpoints', () => {
    let students: StudentInstance[]

    beforeEach(async () => {
        await sequelize.sync({ force: true })
        students = await Student.bulkCreate([{
            name: 'Luís Levi Porto',
            email: 'luisleviporto@jarretta.com',
            academic_record: '027841',
            cpf: '45518142889',
            created_at: new Date(),
            updated_at: new Date()
        }, {
            name: 'Raquel Brenda Yasmin Vieira',
            email: 'raquel_vieira@araraquara.com.br',
            academic_record: '343553',
            cpf: '72566293465',
            created_at: new Date(),
            updated_at: new Date()
        }, {
            name: 'Luzia Juliana Heloisa da Costa',
            email: 'luzia.juliana.dacosta@way.com.br',
            academic_record: '375639',
            cpf: '77034071357',
            created_at: new Date(),
            updated_at: new Date()
        }])
    })

    afterAll(async () => {
        await sequelize.close()
    })

    it('should return all students on database', async () => {
        const response = await supertest(app).get('/students')

        expect(response.statusCode).toBe(200)
        expect(response.body.students.length).toBe(3)
    })

    it('should return all students on database with pagination', async () => {
        const page = 2
        const perPage = 1

        const response = await supertest(app).get(`/students?perPage=${perPage}&page=${page}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.students.length).toBe(perPage)
        expect(response.body.page).toBe(page)
        expect(response.body.perPage).toBe(perPage)
        expect(response.body.total).toBe(students.length)
        expect(response.body.students[0].name).toBe(students[1].name)

    })    

    // Post

    it('should create a single student when given valid properties', async () => {
        const newStudent = {
            "name": "Martin Gabriel Thomas Melo",
            "email": "martin_melo@midiasim.com.br",
            "academic_record": "783541",
            "cpf": "32729636420"
        }

        const { body, status } = await supertest(app).post('/students').send(newStudent)

        expect(status).toBe(201)
        expect(body.name).toBe(newStudent.name)
        expect(body.email).toBe(newStudent.email)
        expect(body.academic_record).toBe(newStudent.academic_record)
        expect(body.cpf).toBe(newStudent.cpf)
        expect(body).toHaveProperty('createdAt')
        expect(body).toHaveProperty('updatedAt')

    })

    // Field name tests for create a student    

    it('should not create a student without name', async () => {
        const newStudent = {
            "name": "",
            "email": "martin_melo@midiasim.com.br",
            "academic_record": "783541",
            "cpf": "32729636420"
        }

        const { body, status } = await supertest(app).post('/students').send(newStudent)

        expect(status).toBe(409)
        expect(body.message).toBe('Validation error: O campo nome precisa ter entre 10 e 60 caracteres.')

    })

    it('should not create a student with name below minimum size', async () => {
        const newStudent = {
            "name": "Martin",
            "email": "martin_melo@midiasim.com.br",
            "academic_record": "783541",
            "cpf": "32729636420"
        }

        const { body, status } = await supertest(app).post('/students').send(newStudent)

        expect(status).toBe(409)
        expect(body.message).toBe('Validation error: O campo nome precisa ter entre 10 e 60 caracteres.')

    })

    it('should not create a student with name above minimum size', async () => {
        const newStudent = {
            "name": "Martin Gabriel Thomas Melo Martin Gabriel Thomas Melo Martin Gabriel Thomas Melo",
            "email": "martin_melo@midiasim.com.br",
            "academic_record": "783541",
            "cpf": "32729636420"
        }

        const { body, status } = await supertest(app).post('/students').send(newStudent)

        expect(status).toBe(409)
        expect(body.message).toBe('Validation error: O campo nome precisa ter entre 10 e 60 caracteres.')

    })

    it('should not create a student without propertie name', async () => {
        const newStudent = {
            "email": "martin_melo@midiasim.com.br",
            "academic_record": "783541",
            "cpf": "32729636420"
        }

        const { body, status } = await supertest(app).post('/students').send(newStudent)

        expect(status).toBe(409)
        expect(body.message).toBe('notNull Violation: O campo nome não pode ser vazio.')

    })

    // Field email tests for create a student

    it('should not create a student without email', async () => {
        const newStudent = {
            "name": "Martin Gabriel Thomas Melo",
            "email": "",
            "academic_record": "783541",
            "cpf": "32729636420"
        }

        const { body, status } = await supertest(app).post('/students').send(newStudent)

        expect(status).toBe(409)
        expect(body.message).toContain('Validation error: O campo precisa ser um email.')
        expect(body.message).toContain('Validation error: O campo email precisa ter entre 10 e 70 caracteres.')        

    })

    it('should not create a student with email below minimum size', async () => {
        const newStudent = {
            "name": "Martin Gabriel Thomas Melo",
            "email": "r@m.com",
            "academic_record": "783541",
            "cpf": "32729636420"
        }

        const { body, status } = await supertest(app).post('/students').send(newStudent)

        expect(status).toBe(409)
        expect(body.message).toBe('Validation error: O campo email precisa ter entre 10 e 70 caracteres.')

    })

    it('should not create a student with email above minimum size', async () => {
        const newStudent = {
            "name": "Martin Gabriel Thomas Melo",
            "email": "martin_melomartin_melomartin_melomartin_melomartin_melo@midiasim.com.br",
            "academic_record": "783541",
            "cpf": "32729636420"
        }

        const { body, status } = await supertest(app).post('/students').send(newStudent)

        expect(status).toBe(409)
        expect(body.message).toContain('Validation error: O campo email precisa ter entre 10 e 70 caracteres.')

    })

    it('should not create a student without propertie email', async () => {
        const newStudent = {
            "name": "Martin Gabriel Thomas Melo",
            "academic_record": "783541",
            "cpf": "32729636420"
        }

        const { body, status } = await supertest(app).post('/students').send(newStudent)

        expect(status).toBe(409)
        expect(body.message).toBe('notNull Violation: O campo email não pode ser vazio.')

    })

    it('should not create a student with an already registered email', async () => {
        const newStudent = {
            "name": "Martin Gabriel Thomas Melo",
            "email": "luisleviporto@jarretta.com",
            "academic_record": "783541",
            "cpf": "32729636420"
        }

        const { body, status } = await supertest(app).post('/students').send(newStudent)

        expect(status).toBe(409)
        expect(body.message).toBe('Já existe um aluno cadastrado com esse email.')

    })

    // Field academic_record tests for create a student

    it('should not create a student without academic_record', async () => {
        const newStudent = {
            "name": "Martin Gabriel Thomas Melo",
            "email": "martin_melo@midiasim.com.br",
            "academic_record": "",
            "cpf": "32729636420"
        }

        const { body, status } = await supertest(app).post('/students').send(newStudent)

        expect(status).toBe(409)
        expect(body.message).toContain('Validation error: O campo registo acadêmico precisa ter entre 6 e 10 caracteres.')
        expect(body.message).toContain('Validation error: O campo registo acadêmico permite somente números.')

    })

    it('should not create a student with academic_record below minimum size', async () => {
        const newStudent = {
            "name": "Martin Gabriel Thomas Melo",
            "email": "martin_melo@midiasim.com.br",
            "academic_record": "78",
            "cpf": "32729636420"
        }

        const { body, status } = await supertest(app).post('/students').send(newStudent)

        expect(status).toBe(409)
        expect(body.message).toBe('Validation error: O campo registo acadêmico precisa ter entre 6 e 10 caracteres.')

    })

    it('should not create a student with academic_record above minimum size', async () => {
        const newStudent = {
            "name": "Martin Gabriel Thomas Melo",
            "email": "martin_melo@midiasim.com.br",
            "academic_record": "78954783541",
            "cpf": "32729636420"
        }

        const { body, status } = await supertest(app).post('/students').send(newStudent)

        expect(status).toBe(409)
        expect(body.message).toBe('Validation error: O campo registo acadêmico precisa ter entre 6 e 10 caracteres.')

    })

    it('should not create a student without propertie academic_record', async () => {
        const newStudent = {
            "name": "Martin Gabriel Thomas Melo",
            "email": "martin_melo@midiasim.com.br",
            "cpf": "32729636420"
        }

        const { body, status } = await supertest(app).post('/students').send(newStudent)

        expect(status).toBe(409)
        expect(body.message).toBe('notNull Violation: O campo registro acadêmico não pode ser vazio.')

    })

    it('should not create a student with an already registered academic_record', async () => {
        const newStudent = {
            "name": "Martin Gabriel Thomas Melo",
            "email": "martin_melo@midiasim.com.br",
            "academic_record": "027841",
            "cpf": "32729636420"
        }

        const { body, status } = await supertest(app).post('/students').send(newStudent)

        expect(status).toBe(409)
        expect(body.message).toBe('Já existe um aluno cadastrado com esse registro acadêmico.')

    })

    // Field CPF tests for create a student

    it('should not create a student without cpf', async () => {
        const newStudent = {
            "name": "Martin Gabriel Thomas Melo",
            "email": "martin_melo@midiasim.com.br",
            "academic_record": "783541",
            "cpf": ""
        }

        const { body, status } = await supertest(app).post('/students').send(newStudent)

        expect(status).toBe(409)
        expect(body.message).toContain('Validation error: O campo CPF precisa ter 11 caracteres.')
        expect(body.message).toContain('Validation error: O campo CPF permite somente números.')

    })

    it('should not create a student with cpf below minimum size', async () => {
        const newStudent = {
            "name": "Martin Gabriel Thomas Melo",
            "email": "martin_melo@midiasim.com.br",
            "academic_record": "783541",
            "cpf": "3272963642"
        }

        const { body, status } = await supertest(app).post('/students').send(newStudent)

        expect(status).toBe(409)
        expect(body.message).toBe('Validation error: O campo CPF precisa ter 11 caracteres.')

    })

    it('should not create a student with cpf above minimum size', async () => {
        const newStudent = {
            "name": "Martin Gabriel Thomas Melo",
            "email": "martin_melo@midiasim.com.br",
            "academic_record": "783541",
            "cpf": "3272963642012"
        }

        const { body, status } = await supertest(app).post('/students').send(newStudent)

        expect(status).toBe(409)
        expect(body.message).toBe('Validation error: O campo CPF precisa ter 11 caracteres.')

    })

    it('should not create a student without propertie cpf', async () => {
        const newStudent = {
            "name": "Martin Gabriel Thomas Melo",
            "email": "martin_melo@midiasim.com.br",
            "academic_record": "783541"
        }

        const { body, status } = await supertest(app).post('/students').send(newStudent)

        expect(status).toBe(409)
        expect(body.message).toBe('notNull Violation: O campo CPF não pode ser vazio.')

    })

    it('should not create a student with an already registered cpf', async () => {
        const newStudent = {
            "name": "Martin Gabriel Thomas Melo",
            "email": "martin_melo@midiasim.com.br",
            "academic_record": "783541",
            "cpf": students[2].cpf
        }

        const { body, status } = await supertest(app).post('/students').send(newStudent)

        expect(status).toBe(409)
        expect(body.message).toBe('Já existe um aluno cadastrado com esse CPF.')

    })

    // Patch

    it('should update a single student when given valid properties', async () => {
        const updatedStudent = {
            "name": "Luís Levi Porto Pereira",
            "email": "luisleviporto@jarretta.com"
        }

        const { body, status } = await supertest(app).patch('/students/' + students[0].cpf).send(updatedStudent)

        expect(status).toBe(200)
        expect(body.name).toBe(updatedStudent.name)
        expect(body.email).toBe(updatedStudent.email)
        expect(body.academic_record).toBe(students[0].academic_record)
        expect(body.cpf).toBe(students[0].cpf)
        expect(body).toHaveProperty('createdAt')
        expect(body).toHaveProperty('updatedAt')

    })

    it('should not update a student when given an invalid cpf', async () => {
        const updatedStudent = {
            "name": "Luís Levi Porto Pereira",
            "email": "luisleviporto@jarretta.com"
        }

        const { body, status } = await supertest(app).patch('/students/' + students[0].cpf + '9').send(updatedStudent)

        expect(status).toBe(404)
        expect(body.message).toBe('Student not found')

    })

    // Field name tests for update a student    

    it('should not update a student without name', async () => {
        const updatedStudent = {
            "name": "",
            "email": "luisleviporto@jarretta.com"
        }

        const { body, status } = await supertest(app).patch('/students/' + students[0].cpf).send(updatedStudent)

        expect(status).toBe(409)
        expect(body.message).toBe('Validation error: O campo nome precisa ter entre 10 e 60 caracteres.')

    })

    it('should not update a student with name below minimum size', async () => {
        const updatedStudent = {
            "name": "Luís",
            "email": "luisleviporto@jarretta.com"
        }

        const { body, status } = await supertest(app).patch('/students/' + students[0].cpf).send(updatedStudent)

        expect(status).toBe(409)
        expect(body.message).toBe('Validation error: O campo nome precisa ter entre 10 e 60 caracteres.')

    })

    it('should not update a student with name above minimum size', async () => {
        const updatedStudent = {
            "name": "Luís Levi Porto Pereira Luís Levi Porto Pereira Luís Levi Porto Pereira",
            "email": "luisleviporto@jarretta.com"
        }

        const { body, status } = await supertest(app).patch('/students/' + students[0].cpf).send(updatedStudent)

        expect(status).toBe(409)
        expect(body.message).toBe('Validation error: O campo nome precisa ter entre 10 e 60 caracteres.')

    })

    it('should not update a student without propertie name', async () => {
        const updatedStudent = {
            "email": "luisleviporto@jarretta.com"
        }

        const { body, status } = await supertest(app).patch('/students/' + students[0].cpf).send(updatedStudent)

        expect(status).toBe(409)
        expect(body.message).toBe('notNull Violation: O campo nome não pode ser vazio.')

    })

    // Field email tests for update a student

    it('should not update a student without email', async () => {
        const updatedStudent = {
            "name": "Luís Levi Porto Pereira",
            "email": ""
        }

        const { body, status } = await supertest(app).patch('/students/' + students[0].cpf).send(updatedStudent)

        expect(status).toBe(409)
        expect(body.message).toContain('Validation error: O campo precisa ser um email.')
        expect(body.message).toContain('Validation error: O campo email precisa ter entre 10 e 70 caracteres.')

    })

    it('should not update a student with email below minimum size', async () => {
        const updatedStudent = {
            "name": "Luís Levi Porto Pereira",
            "email": "r@m.com"
        }

        const { body, status } = await supertest(app).patch('/students/' + students[0].cpf).send(updatedStudent)

        expect(status).toBe(409)
        expect(body.message).toBe('Validation error: O campo email precisa ter entre 10 e 70 caracteres.')

    })

    it('should not update a student with email above minimum size', async () => {
        const updatedStudent = {
            "name": "Luís Levi Porto Pereira",
            "email": "martin_melomartin_melomartin_melomartin_melomartin_melo@midiasim.com.br"
        }

        const { body, status } = await supertest(app).patch('/students/' + students[0].cpf).send(updatedStudent)

        expect(status).toBe(409)
        expect(body.message).toContain('Validation error: O campo email precisa ter entre 10 e 70 caracteres.')

    })

    it('should not update a student without propertie email', async () => {
        const updatedStudent = {
            "name": "Luís Levi Porto Pereira"
        }

        const { body, status } = await supertest(app).patch('/students/' + students[0].cpf).send(updatedStudent)

        expect(status).toBe(409)
        expect(body.message).toBe('notNull Violation: O campo email não pode ser vazio.')

    })

    it('should not update a student with an already registered email', async () => {
        const updatedStudent = {
            "name": "Luís Levi Porto Pereira",
            "email": students[1].email
        }

        const { body, status } = await supertest(app).patch('/students/' + students[0].cpf).send(updatedStudent)

        expect(status).toBe(409)
        expect(body.message).toBe('Já existe um aluno cadastrado com esse email.')

    })

    // Get by cpf

    it('should get a student when given valid cpf', async () => {

        const { body, status } = await supertest(app).get('/students/' + students[0].cpf)

        expect(status).toBe(200)
        expect(body.name).toBe(students[0].name)
        expect(body.email).toBe(students[0].email)
        expect(body.academic_record).toBe(students[0].academic_record)
        expect(body.cpf).toBe(students[0].cpf)
        expect(body).toHaveProperty('createdAt')
        expect(body).toHaveProperty('updatedAt')

    })

    it('should not get a student when given an invalid cpf', async () => {

        const { body, status } = await supertest(app).get('/students/' + students[0].cpf + '9')

        expect(status).toBe(404)
        expect(body.message).toBe('Student not found')

    })

    // Delete by cpf

    it('should delete a student when given valid cpf', async () => {

        const { body, status } = await supertest(app).delete('/students/' + students[0].cpf)

        expect(status).toBe(204)
        expect(body.message).toBeUndefined()

    })

    it('should not delete a student when given an invalid cpf', async () => {

        const { body, status } = await supertest(app).delete('/students/' + students[0].cpf + '9')

        expect(status).toBe(404)
        expect(body.message).toBe('Student not found')

    })

})