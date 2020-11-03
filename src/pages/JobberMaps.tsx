import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiArrowRight, FiSearch } from 'react-icons/fi'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

import mapMarkerImg from '../images/Logo.svg'

import '../styles/pages/jobber-map.css'
import mapIcon from '../utils/mapIcon';
import api from '../services/api';
import Axios from 'axios';

interface Jobber {
    id: number;
    latitude: number;
    longitude: number;
    name: string;
}

const OrphanegesMap: React.FC = () => {
    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)
    const [cityName, setCityName] = useState('');
    const [stateName, setStateName] = useState('');
    const [services, setServices] = useState('');
    const [users, setUsers] = useState<any>([]);

    useEffect(() => {
        const loadCurrentPosition = async () => {
            if (navigator.geolocation) {

                try {
                    await navigator.geolocation.getCurrentPosition(async (position) => {
                        setLatitude(position.coords.latitude)
                        setLongitude(position.coords.longitude)

                        const response = await Axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${process.env.REACT_APP_GOOGLE_API}`)
                        setCityName(response.data.results[0].address_components[2].short_name);
                        setStateName(response.data.results[0].address_components[3].long_name);
                    })

                } catch (err) {
                    alert('Precisamos de sua Localização para podermos fazer a busca de serviços!');
                    loadCurrentPosition();
                }
            }
            else {
                alert('As funcionalidades do Website não são suportadas pelo seu navegador, por favor, utilize o Chrome ou Firefox Mozilla');
            }
        }

        loadCurrentPosition();
    }, [])

    async function loadUsers() {
        const response = await api.get('/search', {
            params: {
                latitude: latitude,
                longitude: longitude,
                services,
            }
        });
        setUsers(response.data.users);
    }

    const debounceEvent = (fn: Function, wait = 1000, time: any) => (...args: any) => {
        clearTimeout(time)
        time = setTimeout(() => {
            fn(...args)
        }, wait)
    }

    function handleKeyUp() {
        loadUsers()
    }

    return (
        <div id="page-map">
            <aside>
                <header>
                    <img src={mapMarkerImg} alt="Mapa" width="120" />

                    <h2>Pesquise por um serviço</h2>
                    <p>Os profissionais aparecerão no mapa :)</p>
                </header>

                <div className="input-block">
                    <input
                        id="name"
                        placeholder="Serviço"
                        value={services}
                        onChange={event => setServices(event.target.value)}
                        onKeyUp={debounceEvent(handleKeyUp, 1000, 500)}

                    />
                    <FiSearch size={35} color="#FFF" className="searchService" onClick={loadUsers} />
                </div>

                <footer>
                    <strong>{stateName}</strong>
                    <span>{cityName}</span>
                </footer>
            </aside>

            <Map
                center={[latitude, longitude]}
                zoom={15}
                style={{ width: "100%", height: "100%" }}
            >
                {/* <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
                <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} />

                {users.length !== 0 && users.map((user: any) => {
                    return (
                        <Marker
                            position={[user.location?.coordinates[1], user.location?.coordinates[0]]}
                            icon={mapIcon}
                            key={user._id}
                        >
                            <Popup closeButton={false} minWidth={240} maxWidth={240} className="mapPopup">
                                <img src={user?.images[0]?.path} alt="BeJobberFound" className="avatar" style={{ width: "50px", height: "50px" }} />
                                {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
                                <Link to={`/jobber/${user._id}`}>
                                    <FiArrowRight size={20} color="#FFF" />
                                </Link>
                            </Popup>
                        </Marker>
                    )
                })}

            </Map>

            <Link to="/jobber/create" className="create-jobber">
                <FiPlus size={32} color="#fff" />
            </Link>
        </div>
    );
}

export default OrphanegesMap;