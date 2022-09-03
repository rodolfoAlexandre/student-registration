'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('students', [{
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
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('students', null, {});
  }
};