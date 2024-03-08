import { useContextSelector } from 'use-context-selector'
import { Header } from '../../components/Header'
import { Summary } from '../../components/Summary'
import { TransactionsContext } from '../../contexts/TransactionsContext'
import { dateFormatter, priceFormatter } from '../../utils/formatter'
import { SearchForm } from './components/SearchForm'
import { EmptyTable } from './styles'

import {
  PriceHighlight,
  TransactionsContainer,
  TransactionsTable,
} from './styles'

export function Transactions() {
  const transactions = useContextSelector(TransactionsContext, (context) => {
    return context.transactions
  })

  return (
    <div>
      <Header />
      <Summary />

      <TransactionsContainer>
        <SearchForm />

        <TransactionsTable>
          <thead>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Categoria</th>
            <th>Data</th>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              return (
                <tr key={transaction.ID_transactions}>
                  <td width="50%">{transaction.description}</td>
                  <td>
                    <PriceHighlight variant='income'>
                      {priceFormatter.format(Number(transaction.amount))}
                    </PriceHighlight>
                  </td>
                  <td>{transaction.category}</td>
                  <td>
                    {dateFormatter.format(new Date(transaction.date))}
                  </td>
                </tr>
              )
            })}

            {transactions.length === 0 && (
              <EmptyTable>Não existem itens cadastrados.</EmptyTable>
            )}
          </tbody>
        </TransactionsTable>
      </TransactionsContainer>
    </div>
  )
}
