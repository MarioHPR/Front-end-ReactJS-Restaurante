import React, { useState } from 'react';
import api from '../../services/api';

export default function Login({ history }) {
    const [email, setEmail] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();// evita que fique redirecionando a tela

        const response = await api.post('/sessions', { email });
        const { _id } = response.data;
        localStorage.setItem('user', _id);

        history.push('/dashboard');

    }

    return (
        <>
            <p>
                Indique seu <strong>restaurante</strong> favorito e participe da votação diária do <strong>restaurante da rodada!</strong>
            </p>

            <form onSubmit={handleSubmit}>
                <label htmlFor="email">E-MAIL *</label>
                <input
                    type="email"
                    id="email"
                    placeholder="Seu e-mail"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                />

                <button className="btn" type="submit">Entrar</button>
            </form>
        </>
    )
}