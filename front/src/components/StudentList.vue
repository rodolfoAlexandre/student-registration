<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="studentsList"
      sort-by="createdAt"
      class="elevation-1"
      :server-items-length="serverItemsLength"
      @update:items-per-page="changeItemsPerPage"
      @pagination="changePage"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Pesquisar"
            single-line
            hide-details
            @change="changeSearch"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="success" dark class="mb-2" v-bind="attrs" v-on="on">
                Cadastrar novo aluno
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <form action="" v-on:submit.prevent="checkForm">
                    <v-row>
                      <v-col v-if="editedIndex === -1" cols="12" sm="6" md="12">
                        <v-text-field
                          v-model="editedItem.academic_record"
                          label="Registro Acadêmico"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field
                          v-model="editedItem.name"
                          label="Nome"
                        ></v-text-field>
                      </v-col>
                      <v-col v-if="editedIndex === -1" cols="12" sm="6" md="12">
                        <v-text-field
                          v-model="editedItem.cpf"
                          label="CPF"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field
                          v-model="editedItem.email"
                          label="Email"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancelar
                </v-btn>
                <v-btn color="blue darken-1" text @click="save"> Salvar </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="600px">
            <v-card>
              <v-card-title class="text-h5"
                >Tem certeza que deseja deletar esse aluno?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancelar</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >Confirmar</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)" color="primary">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)" color="error">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <v-progress-linear
      v-if="!loaded"
      indeterminate
      color="green"
    ></v-progress-linear>

    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}
      <template v-slot:action="{ attrs }">
        <v-btn v-bind="attrs" text @click="snack = false"> Fechar </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import api from "@/services/api";

export default {
  data: () => ({
    snack: false,
    snackColor: "",
    snackText: "",
    loaded: false,
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "Registro Acadêmico", align: "start", value: "academic_record" },
      { text: "Nome", value: "name" },
      { text: "CPF", value: "cpf" },
      { text: "Email", value: "email" },
      { text: "Data Criação", value: "createdAt" },
      { text: "Ações", value: "actions", sortable: false },
    ],
    errorsValidation: [],
    studentsList: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      email: "",
      cpf: "",
      academic_record: "",
    },
    defaultItem: {
      name: "",
      email: "",
    },
    search: "",
    serverItemsLength: 0,
    page: 1,
    itemsPerPage: 10,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Novo Aluno" : "Editar Aluno";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  // eslint-disable-next-line
  created() {},

  methods: {
    checkForm() {
      this.errorsValidation = [];

      if (this.editedItem.academic_record === "")
        this.errorsValidation.push("O Campo registro acadêmico deve ser preenchido.")

      if (this.editedItem.name === "")
        this.errorsValidation.push("O Campo nome deve ser preenchido.")

      if (this.editedItem.cpf === "")
        this.errorsValidation.push("O Campo CPF deve ser preenchido.")

      if (this.editedItem.email === "")
        this.errorsValidation.push("O Campo email deve ser preenchido.")
    },

    changeSearch() {
      if (this.search) this.initialize();
    },

    changePage(page) {
      this.page = page;
      this.initialize();
    },

    changeItemsPerPage(itemsPerPage) {
      this.itemsPerPage = itemsPerPage;
      this.initialize();
    },

    maskCpf(value) {
      return (
        value[0] +
        value[1] +
        value[2] +
        "." +
        value[3] +
        value[4] +
        value[5] +
        "." +
        value[6] +
        value[7] +
        value[8] +
        "-" +
        value[9] +
        value[10]
      );
    },

    onlyNumbers(string) {
      var numsStr = string.replace(/[^0-9]/g, "");
      return parseInt(numsStr);
    },

    async initialize() {
      try {

        let url = "";

        if (this.itemsPerPage === -1)
          url = `/students?perPage=10000&page=1&search=${this.search}`;
        else
          url = `/students?perPage=${this.itemsPerPage}&page=${this.page.page}&search=${this.search}`;

        await api.get(url).then((response) => {

          if (response.data) {
            this.studentsList = response.data.students.map((item) => {
              item.cpf = this.maskCpf(item.cpf);
              item.createdAt = new Date(item.createdAt).toLocaleString();
              return item;
            });
            this.loaded = true;
            this.serverItemsLength = response.data.total;
          }
        });
      } catch (error) {
        if (error.response.status && error.response.status === 409) {
          this.snackError(error.response.data.message);
        } else {
          this.snackError(error.response);
        }
      }
    },

    editItem(item) {
      this.editedIndex = this.studentsList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.studentsList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        await api
          .delete("/students/" + this.onlyNumbers(this.editedItem.cpf))
          .then((response) => {
            if (response) {
              this.initialize();
              this.snackSuccess("Aluno removido com sucesso.");
            }
          });
      } catch (error) {
        this.snackError(error.response.data.message);
      }

      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {

      this.checkForm();

      if (this.errorsValidation.length > 0) {
        this.snackError(...this.errorsValidation);
      }
      else {

        if (this.editedIndex > -1) {
          // Update
          try {
            const body = {
              name: this.editedItem.name,
              email: this.editedItem.email,
            };

            await api
              .patch("/students/" + this.onlyNumbers(this.editedItem.cpf), body)
              .then((response) => {
                if (response) {
                  this.initialize();
                  this.close();
                  this.snackSuccess("Aluno atualizado com sucesso.");
                }
              });
          } catch (error) {
            if (error.response.status && error.response.status === 409) {
              this.snackError(error.response.data.message);
            } else {
              this.snackError(error.response);
            }
          }
        } else {
          // Save
          try {
            const body = {
              name: this.editedItem.name,
              email: this.editedItem.email,
              academic_record: this.editedItem.academic_record,
              cpf: this.editedItem.cpf,
            };

            await api.post("/students", body).then((response) => {
              if (response) {
                this.initialize();
                this.close();
                this.snackSuccess("Aluno cadastrado com sucesso.");
              }
            });
          } catch (error) {
            if (error.response.status && error.response.status === 409) {
              this.snackError(error.response.data.message);
            } else {
              this.snackError(error.response);
            }
          }
        }
      }
    },

    snackError(msg) {
      this.snack = true;
      this.snackColor = "error";
      this.snackText = msg
        .replaceAll("Validation error: ", "")
        .replaceAll(".,", ".")
        .replaceAll("notNull Violation: ", "");
    },

    snackSuccess(msg) {
      this.snack = true;
      this.snackColor = "success";
      this.snackText = msg;
    },
  },
};
</script>