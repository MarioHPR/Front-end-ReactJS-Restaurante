import React, { useState, useMemo } from 'react';
import api from '../../services/api';
import './styles.css';
import camera from '../../assets/camera.png';

export default function New( { history } ) {
    const [restaurante, setRestaurante] = useState('');
    const [imagem, setImagem] = useState(null);

    const preview = useMemo(() => {
        return imagem ? URL.createObjectURL(imagem) : null;
    }, [imagem] );

    async function handleSubmit(event) {
        event.preventDefault();

        const data = new FormData();
        const user_id = localStorage.getItem('user');

        data.append('imagem', imagem);
        data.append('restaurante', restaurante);

        await api.post('spots', data, {
            headers : {user_id}
        });

        history.push('/dashboard'); // retorna o usuario para a pag dashboard
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label
                    id="imagem"
                    style={{background: `url(${preview})` }}
                    className={imagem ? 'has-imagem' : ''}
                >
                    <input type="file" onChange={event => setImagem(event.target.files[0])} />
                    <img id="camera" src={camera} alt="Selecione uma imagem" />
                </label>
                <label htmlFor='restaurante'>Restaurante *</label>
                <input
                    id="restaurante"
                    placeholder="Nome do restaurante"
                    value={restaurante}
                    onChange={event => setRestaurante(event.target.value)}
                />

                <button type="submit" className="btn">Cadastrar</button>
            </form>
        </>
    )
}