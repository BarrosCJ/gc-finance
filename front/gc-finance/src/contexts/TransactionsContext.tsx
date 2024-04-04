import { ReactNode, useCallback, useEffect, useState } from 'react'
import { createContext } from 'use-context-selector'
import { api } from '../lib/axios'

interface Transaction {
  ID_transactions: number
  description: string
  // type: 'income' | 'outcome'
  amount: string
  category?: string
  date: string
}

interface User {
  nome: string,
  email: string,
  telefone: string,
  cpf: string,
  senha: string,
}

interface CreateTransactionInput {
  description: string
  amount: number
  category: string
  // type: 'income' | 'outcome'
}

interface CreateUserInput {
  nome: string
  email: string
  telefone: string
  cpf: string
  senha: string
}

interface TransactionContextType {
  transactions: Transaction[]
  user: User | undefined
  fetchTransactions: (query?: string) => Promise<void>
  createTransaction: (data: CreateTransactionInput) => Promise<void>
  createUser: (data: CreateUserInput) => Promise<void>
}

interface TransactionsProviderProps {
  children: ReactNode
}

export const TransactionsContext = createContext({} as TransactionContextType)

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [user, setUser] = useState<User>()

  const fetchTransactions = useCallback(async () => {
    const response = await api.get('transactions')

    setTransactions(response.data)
  }, [])

  const createTransaction = useCallback(
    async (data: CreateTransactionInput) => {
      const { description, amount, category } = data

      const response = await api.post('transaction', {
        description,
        amount,
        category,
        // type,
        date: new Date(),
      })

      setTransactions((state) => [response.data, ...state])
    },
    [],
  )

  const createUser = useCallback(
    async (data: CreateUserInput) => {
      const {nome, email, telefone, cpf, senha} = data

      const response = await api.post("cadastro_clientes", {
        nome, email, telefone, cpf, senha
      })

      setUser(response.data)
    },
    [],
  )

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        user,
        fetchTransactions,
        createTransaction,
        createUser,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
