import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    if (!['income', 'outcome'].includes(type)) {
      throw new AppError(`Invalid operation type: '${type}'`);
    }

    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw new AppError(
        `Insufficient balance for this transaction. Your current balance is ${balance.total}`,
      );
    }

    let categoryResult = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryResult) {
      categoryResult = categoryRepository.create({ title: category });

      await categoryRepository.save(categoryResult);
    }

    const newTransaction = transactionsRepository.create({
      title,
      value,
      type,
      category: categoryResult,
    });

    await transactionsRepository.save(newTransaction);

    return newTransaction;
  }
}

export default CreateTransactionService;
