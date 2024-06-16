import React, { useEffect, useState } from "react";
import './styles/profile.css';
import {useDispatch} from "react-redux";
import { logout } from "../reducers/userReducer";
import profile from '../assets/img/profile.png'
import {useNavigate,useLocation} from "react-router-dom";

import Tab from './Tab'
import { Link } from "react-router-dom";
import config from "../config";

import house from '../assets/icons/home-outline.svg';
import house2 from '../assets/icons/home.svg';

import box from '../assets/icons/layers-outline.svg';
import box2 from '../assets/icons/layers.svg';


import user from '../assets/icons/person-circle-outline.svg';
import user2 from '../assets/icons/person-circle.svg';


const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Profile = () => {
    const dispatch = useDispatch()
    const location = useLocation();

    const [userData, setUserData] = useState(null);
    const titlePage = 'Профиль';

    useEffect(() => {
        // Функция для получения данных профиля пользователя
        const fetchUserProfile = async () => {
            try {
                // Отправляем GET запрос на сервер для получения данных профиля
                const response = await fetch(`${config.apiUrl}/api/auth/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Передаем токен в заголовке запроса
                    }
                });

                // Проверяем, успешно ли выполнен запрос
                if (response.ok) {
                    // Если запрос успешен, получаем данные профиля из ответа
                    const data = await response.json();
                    setUserData(data.user); // Сохраняем данные профиля в состоянии
                } else {
                    // Если произошла ошибка, выводим сообщение об ошибке
                    console.error('Failed to fetch user profile:', response.statusText);
                }
            } catch (error) {
                // Если произошла ошибка при выполнении запроса, выводим сообщение об ошибке
                console.error('Error fetching user profile:', error.message);
            }
        };

        // Вызываем функцию для получения данных профиля пользователя
        fetchUserProfile();
    }, []); // Запрос будет выполнен только при первом рендере компонента

    const navigate  = useNavigate();
    

    return (
      
        <div className="profile">
        
        <header className="header">
                    <div className='LogoHeader'>
                      <div className="title2">
                        {titlePage}
                      </div>
                    </div>

                    <ul className="Menu">
                        <Link to="/main" className="tabbutton-menu">
                            <img className="icons-svg" src={location.pathname === '/main' ? house2 : house} alt="" />
                            <p style={location.pathname === '/main' ? { color: '#1F800C' } : { color: '#808080' } }>Главная</p>
                        </Link>
                        
                        <Link to="/parcels" className="tabbutton-menu" >
                            <img className="icons-svg" src={location.pathname === '/parcels' ? box2 : box}  alt="" />
                            <p style={location.pathname === '/parcels' ? { color: '#1F800C' } : { color: '#808080' } }>Посылки</p>
                        </Link>

                        {/* <Link to="/notification" className="tabbutton-menu" >
                            <img src={location.pathname === '/notification' ? bell2 : bell} alt="" />
                            <p>Уведомление</p>
                        </Link> */}

                        <Link to="/profile" className="tabbutton-menu" >
                            <img className="icons-svg" src={location.pathname === '/profile' ? user2 : user}  alt="" />
                            <p style={location.pathname === '/profile' ? { color: '#1F800C' } : { color: '#808080' } }>Профиль</p>
                        </Link>
                        {userData && userData.role === 'admin' && (
                            <Link to="/dashboard" className="tabbutton-menu">Панель управления</Link>
                        )}
                        {userData && userData.role === 'filial' && (
                            <Link to="/dashboard" className="tabbutton-menu">Панель управления</Link>
                        )}
                        
                    </ul>

                </header>
        <div className="section__profile">
          <img src={profile} alt="" className="profile__img" />
          {userData ? (
            <div>
              <p className="name info-el">{userData.name} {userData.surname}</p>
              <p className="info-el">Телефон номер: {userData.phone}</p>
              <p className="info-el">Аккаунт создан: {formatDate(userData.createdAt)}</p>
            </div>
          ) : (
            <p>Загрузка...</p>
          )}
          {/* <div className="verify">Пройти верификацию</div> */}
          {userData && userData.role === 'admin' && (
            <Link to="/dashboard" className="verify">Панель управления</Link>
          )}
          {userData && userData.role === 'filial' && (
            <Link to="/dashboard" className="verify">Панель управления</Link>
          )}
          <div className="logout" onClick={() => {
              dispatch(logout());
              navigate("/");
          }}>Выйти</div>
        </div>
        <div className="area3"></div>
        <Tab />
      </div>

    )
}

export default Profile;