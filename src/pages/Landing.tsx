import React, { useEffect, useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';

import '../styles/pages/landing.css'

import logoImg from '../images/Logo.svg'
import { Link } from 'react-router-dom';
import Axios from 'axios';



const Landing: React.FC = () => {
    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)
    const [cityName, setCityName] = useState('');
    const [stateName, setStateName] = useState('');

    useEffect(() => {
        const loadCurrentPosition = async () => {
            if (navigator.geolocation) {
                await navigator.geolocation.getCurrentPosition(async (position) => {
                    setLatitude(position.coords.latitude)
                    setLongitude(position.coords.longitude)

                    const response = await Axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${process.env.REACT_APP_GOOGLE_API}`)
                    setCityName(response.data.results[0].address_components[2].short_name);
                    setStateName(response.data.results[0].address_components[3].short_name);
                })

            }
            else {
                alert('As funcionalidades do Website não são suportadas pelo seu navegador, por favor, utilize o Chrome ou Firefox Mozilla');
            }
        }

        loadCurrentPosition();
    }, [])

    if (latitude === 0 || longitude === 0) {
        return (
            <h1>Carregando...</h1>
        )
    }

    return (
        <div id="page-landing">
            <div className="content-wrapper">
                <img src={logoImg} alt="BeJobber Logo" />

                <main>
                    <h1>Encontre o serviço que você precisa!</h1>
                    <p>Procure por profissionais próximo de você!</p>
                </main>

                <div className="location">
                    <strong>{stateName}</strong>
                    <span>{cityName}</span>
                </div>

                <Link to="/app" className="enter-app">
                    <FiArrowRight size={26} color="rgba(0,0,0,0.6)" />
                </Link>
            </div>
        </div>
    );
}

export default Landing;