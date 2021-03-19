import React, { ChangeEvent, FormEvent, useState } from "react";

import { FiPlus, FiX } from "react-icons/fi";

import '../styles/pages/create-jobber.css';
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { useHistory } from "react-router-dom";
import InputMask from 'react-input-mask';
import PropagateLoader from 'react-spinners/PropagateLoader'

export default function CreateJobber() {
  const history = useHistory();


  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [psswd, setPsswd] = useState('');
  const [confirmPsswd, setConfirmPsswd] = useState('');
  const [address, setAddress] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [services, setServices] = useState('');
  const [working_hours, setWorkingHours] = useState('');
  const [work_on_weekends, setWorkOnWeekends] = useState(true);
  const [images, setImages] = useState<any[]>([])
  const [previewImages, setPreviewImages] = useState<any[]>([])

  const [loading, setLoading] = useState(false)

  // const [inputTag, setInputTag] = useState<any>()
  // const [tags, setTags] = useState<string[]>([])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (confirmPsswd !== psswd) {
      alert('A confirmação de senha não é igual a senha digita, por favor, digite ambas novamente');
      setLoading(false);
      return;
    }

    if (images.length === 0) {
      alert('Por favor, selecione pelo menos uma imagem de você ou seu serviço!');
      setLoading(false);
      return;
    }

    setLoading(true);

    const data = new FormData();

    data.append('name', name);
    data.append('cpf', cpf);
    data.append('phone', phone);
    data.append('bio', bio);
    data.append('email', email);
    data.append('psswd', psswd);
    data.append('address', address);
    data.append('houseNumber', houseNumber);
    data.append('city', city);
    data.append('state', state);
    data.append('services', services);
    data.append('working_hours', working_hours);
    data.append('work_on_weekends', String(work_on_weekends));

    images.forEach(image => {
      data.append('images', image);
    })

    await api.post('users', data, {
                headers: {
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            });

    alert('Cadastro Realizado com Sucesso!')

    history.push('/app')
  }

  function handleSelectedImages(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return;
    }

    const selectedImages = Array.from(event.target.files)

    if (selectedImages[0].type.split('/')[0] !== 'image') {
      alert('Por Favor, selecione somente Imagens');
      return;
    }

    if (selectedImages[0].type.split('/')[1] !== 'jpeg' && selectedImages[0].type.split('/')[1] !== 'jpg' && selectedImages[0].type.split('/')[1] !== 'jfif' && selectedImages[0].type.split('/')[1] !== 'png') {
      alert('Formato de Imagem Invalido! Formatos suportados: JPEG, JPG, PNG, JFIF');
      return;
    }

    if (images.length === 0) {
      setImages(selectedImages)
    } else {
      setImages([...images, selectedImages])
    }

    const selectedImagesPreview = selectedImages.map(image => {
      return URL.createObjectURL(image);
    })

    if (previewImages.length === 0) {
      setPreviewImages(selectedImagesPreview)
    } else {
      setPreviewImages([...previewImages, selectedImagesPreview])
    }
  }

  function handleDeleteImage(imageIndex: number) {
    const arrayPreviewImage = previewImages.filter((value, index) => {
      return index !== imageIndex
    });
    const arrayImages = images.filter((value, index) => {
      return index !== imageIndex
    });
    setImages(arrayImages);
    setPreviewImages(arrayPreviewImage)
  }

  // function addTags(event: React.KeyboardEvent<HTMLTextAreaElement>) {
  //   const keyPressedIsEnter = event.key === 'Enter';
  //   if (keyPressedIsEnter) {
  //     services.split(',').forEach(tag => {
  //       if (tag.length > 1) {
  //         if (tags.length === 1)
  //           setTags([tag]);
  //         else
  //           setTags([...tags, tag]);
  //       }
  //     })

  //     console.log("oi", tags);

  //     setServices('');
  //     updateTags();
  //   }
  // }

  // function updateTags() {

  //   clearTags();
  //   tags.slice().reverse().forEach((tag: string) => {
  //     inputTag.prepend(createTag(tag))
  //   })
  // }

  // function createTag(tag: string) {
  //   const div = document.createElement('div');
  //   div.className = 'tag';

  //   const span = document.createElement('span');
  //   span.innerHTML = tag;
  //   div.append(span);

  //   const i = document.createElement('i');
  //   i.classList.add('close');
  //   i.setAttribute('data-item', tag);
  //   i.onclick = removeTag;
  //   span.append(i);

  //   return div;
  // }

  // async function removeTag(event: any) {
  //   const buttonX = event.currentTarget;
  //   const item = buttonX.dataset.item;
  //   const indexTag = tags.indexOf(item);

  //   console.log(tags);

  //   let tagArray: string[] = tags;
  //   tags.length = 0;

  //   await tagArray.map((value: string, index: number) => {
  //     if (index !== indexTag) {
  //       tags.push(value)
  //     }
  //   });

  //   updateTags();
  // }

  // function clearTags() {
  //   inputTag.querySelectorAll('.tag').forEach((tagElement: any) => tagElement.remove())
  // }

  if (loading) {
    return (
      <div className="loadingSpinner">
        <strong className="loadingStrong">Cadastro em Andamento | Por favor, aguarde...</strong>
        <PropagateLoader size={30} color={"#964EDE"} loading={loading} />
      </div>
    )
  }

  return (
    <div id="page-create-jobber">
      <Sidebar />

      <main>
        <form onSubmit={handleSubmit} className="create-jobber-form">
          <fieldset>
            <legend>Dados</legend>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>

            <div className="input-block">
              <label htmlFor="cpf">CPF</label>
              <InputMask mask="999.999.999-99" value={cpf} onChange={(event) => setCpf(event.target.value)} required minLength={11} />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id="about" maxLength={300} value={bio} onChange={event => setBio(event.target.value)} required />
            </div>

            <div className="input-block">
              <label htmlFor="phone">Telefone WhatsApp</label>
              <InputMask mask="(99) 9 9999-9999" value={phone} onChange={(event) => setPhone(event.target.value)} required minLength={11} />
            </div>
          </fieldset>

          <fieldset>
            <legend>Localização</legend>
            <div className="input-block">
              <label htmlFor="address">Logradouro</label>
              <input id="address" value={address} onChange={(event) => setAddress(event.target.value)} required />
            </div>

            <div className="input-block">
              <label htmlFor="houseNumber">Número </label>
              <input id="houseNumber" value={houseNumber} onChange={(event) => setHouseNumber(event.target.value)} className="houseNumberInput" required />
            </div>

            <div className="input-block">
              <label htmlFor="city">Cidade</label>
              <input id="city" value={city} onChange={(event) => setCity(event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1))} required />
            </div>

            <div className="input-block">
              <label htmlFor="state">Estado - SIGLA</label>
              <InputMask mask="aa" value={state} onChange={(event) => setState(event.target.value.toUpperCase())} className="stateInput" required />
            </div>

          </fieldset>

          <fieldset>
            <legend>E-Mail e Senha</legend>
            <div className="input-block">
              <label htmlFor="email">E-Mail</label>
              <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>

            <div className="input-block">
              <label htmlFor="password">Senha</label>
              <input id="password" type="password" value={psswd} onChange={(event) => setPsswd(event.target.value)} required />
            </div>

            <div className="input-block">
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <input id="confirmPassword" type="password" value={confirmPsswd} onChange={(event) => setConfirmPsswd(event.target.value)} className={confirmPsswd === psswd ? '' : 'warning'} required />
            </div>
          </fieldset>

          <fieldset>
            <div className="input-block">
              <label htmlFor="images">Fotos de você e de seus serviços</label>

              <div className="images-container">
                {previewImages.map((image, index) => {
                  return (<div className="eachImage" key={image}>
                    <FiX className="deleteImage" size={30} color="red" onClick={() => handleDeleteImage(index)} />
                    <img src={image} alt={name} />
                  </div>)
                })}

                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>
              <input multiple onChange={handleSelectedImages} type="file" id="image[]" />
            </div>
          </fieldset>

          <fieldset>
            <legend>Serviços</legend>

            <div className="input-block" >
              <div className="tag-container">
              </div>
              <label htmlFor="services">Palavras Chaves para Ser Encontrado <span>Separe os Serviços por Virgula</span></label>
              <input
                id="services"
                value={services}
                onChange={event => { setServices(event.target.value) }}
              // onKeyUp={(event: React.KeyboardEvent<HTMLTextAreaElement>) => addTags(event)} 
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de Funcionamento</label>
              <input id="opening_hours" value={working_hours} onChange={event => setWorkingHours(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                  type="button"
                  className={work_on_weekends ? 'YesActive' : ''}
                  onClick={() => setWorkOnWeekends(true)}
                >
                  Sim
                </button>
                <button
                  type="button"
                  className={!work_on_weekends ? 'NoActive' : ''}
                  onClick={() => setWorkOnWeekends(false)}
                >
                  Não
                  </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
