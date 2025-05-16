import { model, models, Schema } from "mongoose";

const UserSchema = new Schema({
    date: {
        type: String,
        required: [true, 'Data é obrigatório']
    },
    description: {
        type: String
    },
    value: {
        type: Number,
        required: [true, 'Valor da transação é obrigatorio']
    },
    recurrent: {
        type: Boolean,
        required: [true, 'Recorrencia é obrigatorio']
    },
    type: {
        type: Number
    },
    idUser: {
        type: String,
        required: [true, 'idUser é obrigatorio']
    },
    idMonth: {
        type: String,
        required: [true, 'idMonth é obrigatorio']
    },
     recurrenceId: {
        type: String,
    }
})

export const Transactions = models.Transactions || model('Transactions', UserSchema);