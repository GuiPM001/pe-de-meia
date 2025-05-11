import { connectMongo } from "@/core/db/mongodb";
import { Transactions } from "../models/transactions";
import { Transaction } from "../types/Transaction";
import { User } from "../models/user";
import { Months } from "../models/months";
import { monthService } from "./month.service";
import { Month } from "../types/Month";
import { TransactionType } from "../enums/transactionType";

const registerTransaction = async (request: Transaction) => {
    const { date, value, description, recurrent, type, idUser, idMonth } = request;

    if (!value || !date || !recurrent || !type || !idUser || !idMonth)
        throw new Error("É necessario preencher todos os campos para cadastrar uma transação.");

    await connectMongo();


    const user = await User.findById({ _id: idUser });

    if (!user)
        throw new Error("É necessário um usuário cadastrado cadastrar um mês");

    const month = await Months.findById({ id: idMonth });

    if (!month) {

        var balanceMonth = 0;
        switch (request.type) {
            case TransactionType.income:
                balanceMonth += value
                break;
            case TransactionType.expense:
                balanceMonth -= value
                break;
            default:
                balanceMonth
                break;
        }

        var newMonth: Month = {
            id: idMonth,
            balance: balanceMonth,
            idUser
        }

        monthService.saveMonth(newMonth)
    }

    await Transactions.create({
        date,
        value,
        description,
        recurrent,
        type,
        idUser,
        idMonth
    });

    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear();

    var monthsUser = monthService.getMonthsByIdUser(idUser,anoAtual);

    // monthsUser.forEach(element => {
        
    // });
    await monthService.updateMonthBalance(idMonth, idUser, value, type );
};

export const transactionService = { registerTransaction };