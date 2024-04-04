import { Content } from './styles'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TransactionsContext } from '../../contexts/TransactionsContext'
import { useContextSelector } from 'use-context-selector'

const newUserFormSchema = z.object({
    nome: z.string(),
    telefone: z.string(),
    email: z.string(),
    cpf: z.string(),
    senha: z.string()
  })

  type NewUserFormInput = z.infer<typeof newUserFormSchema>
  
export function Register() {
    const createUser = useContextSelector(
        TransactionsContext,
        (context) => {
          return context.createUser
        },
      )

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
        reset,
      } = useForm<NewUserFormInput>({
        resolver: zodResolver(newUserFormSchema),
      })

      async function handleCreateNewUser(data: NewUserFormInput) {
        const {nome, email, telefone, cpf, senha} = data

        await createUser({
            nome, email, telefone, cpf, senha
        })

        reset()
      }

    return (

        <Content>
            <h2>Cadastro de Usuário</h2>
            <form onSubmit={handleSubmit(handleCreateNewUser)}>
                    <input
                        type="text"
                        placeholder="Nome Completo"
                        required
                        {...register('nome')}
                    />

                    <input
                        type="text"
                        placeholder="E-mail"
                        required
                        {...register('email')}
                    />
                    <input
                        type="text"
                        placeholder="Telefone"
                        required
                        {...register('telefone')}
                    />

                    <input
                        type="text"
                        placeholder="CPF"
                        required
                        {...register('cpf')}
                    />

                    <input
                        type="password"
                        placeholder="Senha"
                        required
                        {...register('senha')}
                    />
                    
                    <button type="submit" disabled={isSubmitting}>
                    Cadastrar
                    </button>
                    
                </form>
        </Content>

    )
}
