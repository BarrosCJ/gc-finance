import { ThemeProvider } from 'styled-components'
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom'
import { TransactionsProvider } from './contexts/TransactionsContext'
import { GlobalStyle } from './styles/global'
import { defaultTheme } from './styles/themes/default'
import { Register } from './pages/Register/Register'
import { Login } from './pages/Login/Login'
import { Transactions } from './pages/Transactions'

export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <TransactionsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </TransactionsProvider>
    </ThemeProvider>
  )
}
