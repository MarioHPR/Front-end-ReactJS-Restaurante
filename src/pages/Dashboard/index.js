import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import './styles.css';

export default function Dashboard({ history }) {
    const [spots, setSpots] = useState([]);

    async function acaoVotar(spot) {
        let resposta = null;
        let aux;
        const user_id = localStorage.getItem('user');

        const user = user_id;
        const { id } = spot;
        const d = new Date();
        const date = d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();
        //const date = '1-8-1999'; // para teste
        let minutos = d.getMinutes();
        minutos = minutos > 9 ? minutos : '0' + minutos;
        const hora = d.getHours() + '.' + minutos;
        if(hora < 11.30){
            if (spot.voto === 0) {
                aux = spot.voto + 1;
                resposta = await api.post('/vote', {
                    user: user,
                    spotId: id,
                    voto: aux,
                    date: date
                });
            }
            else {
                aux = spot.voto + 1;
                resposta = await api.put('/vote', { idUser: user, idSpot: spot.id, voto: aux, date });
            }
            if (resposta.data !== null)
                ++spot.voto;
            else {
                alert("Você já votou hoje!")
            }
        }
        else{
            resposta = await api.get('/vote');
            let campea = [2];
            campea[0] = 0;
            campea[1] = 0;
            for (const vots of resposta.data) {
                if(vots.voto > campea[0] && vots.data === date){// valida o vencedor na data atual
                    campea[0] = vots.voto;
                    campea[1] = document.getElementById('n' + vots.spot).innerHTML;
                }
            }
            const semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];

            alert( `Fora de horario para votação! Restaurante vencedor dessa ${semana[d.getDay()]} é ${campea[1]}` )
        }
        history.push('/dashboard'); // retorna o usuario para a pag dashboard
    }

    useEffect(() => {

        async function loadSpots(){
            const user_id = localStorage.getItem('user');
            let response = await api.get('/spots', {
                headers: { user_id }
            });
            const respVoto = await api.get('/vote', {
                headers: { user_id }
            });

            for (let i = 0; i < response.data.length; i++) {
                response.data[i]["voto"] = 0;
                if(respVoto.data.length > 0){
                    for (const iterator of respVoto.data) {
                        if (iterator.spot === response.data[i]._id) {
                            response.data[i].voto = iterator.voto;
                            break;
                        }
                    }
                }
            }
            setSpots(response.data);
        }

        loadSpots();
    },[]);
    return(
        <>
            <div >
                <ul className="spot-list">
                    {spots.map(spot => (
                        <li key={spot._id}>
                            <header style={{ backgroundImage: `url(${spot.thumbnail_url})` }} />
                            <strong id={`n${spot._id}`}>{spot.restaurante}</strong>
                            <span> Votos = {spot.voto}</span>
                            <button onClick={() => acaoVotar(spot)} id={`v${spot._id}`} className='voto'>Votar</button>
                        </li>
                    ))}
                </ul>

                <Link to="/new">
                    <button className='btn'>Cadastrar novo restaurante!</button>
                </Link>
            </div>
        </>
    )
}