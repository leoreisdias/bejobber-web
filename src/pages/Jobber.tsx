import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiClock, FiInfo } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";

import '../styles/pages/jobber.css';
import Sidebar from "../components/Sidebar";
import mapIcon from "../utils/mapIcon";
import api from "../services/api";
import { useParams } from "react-router-dom";

interface Jobber {
  _id: number;
  location: {
    coordinates: number[];
  },
  name: string;
  bio: string,
  email: string,
  phone: string,
  opening_hours: string,
  open_on_weekends: string,
  images: {
    _id: string,
    path: string,
  }[];
  services: string[],
}

interface JobberParams {
  id: string;
}

export default function Orphanage() {
  const params = useParams<JobberParams>();
  const [jobber, setJobber] = useState<Jobber>()
  const [activeImageIndex, setActiveImageIndex] = useState(0);


  useEffect(() => {
    api.get(`users/${params.id}`).then(response => {
      setJobber(response.data.users)
    })
  }, [params.id])


  if (!jobber) {
    return <p>Carregando...</p>
  }

  return (
    <div id="page-jobber">
      <Sidebar />

      <main>
        <div className="jobber-details">
          <img src={jobber.images[activeImageIndex].path} alt="Jobber" />

          <div className="images">
            {jobber.images.map((image, index) => {
              return (
                <button
                  key={image._id}
                  className={activeImageIndex === index ? 'active' : ''}
                  type="button"
                  onClick={() => {
                    setActiveImageIndex(index)
                  }}
                >
                  <img src={image.path} alt="Jobber" />
                </button>
              )
            })
            }
          </div>

          <div className="jobber-details-content">
            <h1>{jobber.name.charAt(0).toUpperCase() + jobber.name.slice(1)}</h1>
            <p>{jobber.bio.charAt(0).toUpperCase() + jobber.bio.slice(1)}</p>

            <div className="map-container">
              <Map
                center={[jobber.location.coordinates[1], jobber.location.coordinates[0]]}
                zoom={16}
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer
                  url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />
                <Marker interactive={false} icon={mapIcon} position={[jobber.location.coordinates[1], jobber.location.coordinates[0]]} />
              </Map>

              <footer>
                <a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${jobber.location.coordinates[1]},${jobber.location.coordinates[0]}`}>Ver rotas no Google Maps</a>
              </footer>
            </div>

            <hr />

            <h2>Instruções para Contato</h2>
            <p>Email: {jobber.email}</p>
            <p>Telefone: {jobber.phone}</p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                Segunda à Sexta <br />
                {jobber.opening_hours}
              </div>
              {jobber.open_on_weekends ? (
                <div className="open-on-weekends">
                  <FiInfo size={32} color="#39CC83" />
                Atendemos <br />
                fim de semana
                </div>
              ) : <div className="open-on-weekends dont-open">
                  <FiInfo size={32} color="#FF669D" />
             Não Atendemos <br />
             fim de semana
           </div>}
            </div>

            <a href={`https://api.whatsapp.com/send?phone=55${jobber.phone}&text=${'Olá, lhe encontrei no BeJobber, poderia me ajudar?'}`} className="whatsAppLink" >
              <button type="button" className="contact-button" >
                <FaWhatsapp size={20} color="#FFF" />
              Entrar em contato
            </button>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}