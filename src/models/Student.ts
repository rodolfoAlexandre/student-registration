import { sequelize } from '../database'
import { DataTypes, Model } from 'sequelize'

export interface StudentInstance extends Model {
    name: string,
    email: string,
    academic_record: string,
    cpf: string,
}

export const Student = sequelize.define<StudentInstance>(
    'students',
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'O campo nome não pode ser vazio.'
                },                
                len: {
                    args: [10, 60],
                    msg: 'O campo nome precisa ter entre 10 e 60 caracteres.'
                }
            }
            
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                name: 'unique_email',
                msg: 'Já existe um aluno cadastrado com esse email.'
            },
            validate: {
                notNull: {
                    msg: 'O campo email não pode ser vazio.'
                },
                isEmail: {
                    msg: 'O campo precisa ser um email.'
                },
                len: {
                    args: [10, 70],
                    msg: 'O campo email precisa ter entre 10 e 70 caracteres.'
                }
            }
        },
        academic_record: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                name: 'unique_academic_record',
                msg: 'Já existe um aluno cadastrado com esse registro acadêmico.'
            },
            validate: {   
                notNull: {
                    msg: 'O campo registro acadêmico não pode ser vazio.'
                },                        
                isNumeric: {
                    msg: 'O campo registo acadêmico permite somente números.'
                },
                len: {
                    args: [6, 10],
                    msg: 'O campo registo acadêmico precisa ter entre 6 e 10 caracteres.'
                }
            }
        },
        cpf: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                name: 'unique_cpf',
                msg: 'Já existe um aluno cadastrado com esse CPF.'
            },
            primaryKey: true,
            validate: {
                notNull: {
                    msg: 'O campo CPF não pode ser vazio.'
                },                
                isNumeric: {
                    msg: 'O campo CPF permite somente números.'
                },
                len: {
                    args: [11, 11],
                    msg: 'O campo CPF precisa ter 11 caracteres.'                    
                }
            }
        },
    }
)