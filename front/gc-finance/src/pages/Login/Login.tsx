import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { TransactionsContext } from '../../contexts/TransactionsContext'
import { useContextSelector } from 'use-context-selector'

import {
    Content,
    // Overlay,
    // TransactionType,
    // TransactionTypeButton,
  } from './styles'
import { useNavigate } from 'react-router-dom'

const newLoginFormSchema = z.object({
    email: z.string().email(),
    senha: z.string().min(4).max(16)
})
  
type NewLoginFormInput = z.infer<typeof newLoginFormSchema>

export function Login() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
        reset,
    } = useForm<NewLoginFormInput>({
        resolver: zodResolver(newLoginFormSchema),
    })

    const login = useContextSelector(
        TransactionsContext,
        (context) => {
          return context.loginUser
        },
    )

    async function handleLogin(data: NewLoginFormInput) {
        const { email, senha } = data

        await login({
            email, senha
        })
        navigate('/transactions ')
        reset()
    }

    const handleRegisterPage = () => {
        navigate("/register")
    }

    return (
        <Content>
            <h2>Login</h2>
            <form onSubmit={handleSubmit(handleLogin)}>
                <input
                    type="text"
                    placeholder="email"
                    required
                    {...register('email')}
                />

                <input
                    type="password"
                    placeholder="senha"
                    required
                    {...register('senha')}                
                />
                <button type="submit" disabled={isSubmitting}>
                    Login
                </button>
            </form>
            <p style={{marginTop: "20px", textAlign: "center"}}>
                Novo usuário?
                <button onClick={handleRegisterPage}>
                    Cadastre-se
                </button>
            </p>
        </Content>
    )
}