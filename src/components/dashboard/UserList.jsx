import React, { useEffect, useState } from "react";
import './css/admin.css';
import search from "../../assets/img/search.png";
import axios from 'axios';
import config from "../../config";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const [sortByDate, setSortByDate] = useState('latest'); // Изначально сортируем по последнему добавленному
  const [searchTerm, setSearchTerm] = useState('');
  const [sortByActivity, setSortByActivity] = useState(false);
  
  const [totalUsers, setTotalUsers] = useState(0);
  
  const [sortByRole, setSortByRole] = useState('');
  const [showByRoleSort, setShowByRoleSort] = useState(false); // Для управления видимостью всплывающего окна
  
  // Функция для установки нового значения currentPage
  const setPage = (newPage) => {
    setCurrentPage(newPage <= 0 ? 1 : newPage);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/api/user/users`, {
          params: {
            page: currentPage,
            limit: perPage,
            search: searchTerm,
            sortByDate: sortByDate,
            sortByActivity: sortByActivity,
            filterByRole : sortByRole
          }
        });

        setUsers(response.data.users);
        setTotalUsers(response.data.totalCount); // Обновление общего количества пользователей
      } catch (error) {
        console.error('Ошибка при получении пользователей:', error.message);
      }
    };

    fetchUsers();
  }, [currentPage, perPage, sortByDate, searchTerm, sortByActivity, sortByRole]);

  const handlePageChange = (e) => {
    setCurrentPage(parseInt(e.target.value, 10));
  };

  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value, 10));
  };

  const handlePageChangePlus = () => {
    setPage(currentPage + 1);
  };

  const handlePageChangeMinus = () => {
    setPage(currentPage - 1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Обновляем поисковый запрос при изменении текста в поле поиска
    setPage(1);
  };

  const handleSortByDate = (type) => {
    setSortByDate(type);
    setSortByActivity(false);
    setCurrentPage(1); // При изменении типа сортировки сбрасываем страницу на первую
  };

  const handleSortByActivity = () => {
    setSortByActivity(!sortByActivity);
    setSortByDate('');
    setCurrentPage(1);
  };

  const toggleRoleSort = () => {
    setShowByRoleSort(!showByRoleSort);
  };

  const handleSortByRole = (role) => {
    setSortByRole(role);
    setShowByRoleSort(false);
    setCurrentPage(1);
  };


  return (
    <div className="users-container">
      <div className="header-bar">
        <div className="search-bar">
          <img src={search} alt="" className="searchIcon" />
          <input
            type="text"
            className="searchInput"
            placeholder="Поиск..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="filter-bar">
          <div
            className={`filter-point ${sortByDate === 'latest' ? 'filter-point-active' : ''}`}
            onClick={() => handleSortByDate('latest')}
          >
            Свежие по дате
          </div>
          <div
            className={`filter-point ${sortByDate === 'oldest' ? 'filter-point-active' : ''}`}
            onClick={() => handleSortByDate('oldest')}
          >
            Старые по дате
          </div>
          <div
            className={`filter-point ${sortByActivity ? 'filter-point-active' : ''}`}
            onClick={handleSortByActivity}
          >
            Сортировка по активности
          </div>

          <div className="status-filter">
                <div className="filter-point" onClick={toggleRoleSort}>
                        {sortByRole || 'Роль'} ↓
                    </div>
                    {showByRoleSort && (
                        <div className="statuses-popup">                                   
                        <div className="filter-point-status" onClick={() => handleSortByRole('')}>
                                Все
                            </div>
                            <div className="filter-point-status" onClick={() => handleSortByRole('client')}>
                            client
                            </div>
                            <div className="filter-point-status" onClick={() => handleSortByRole('filial')}>
                              filial
                            </div>
                            <div className="filter-point-status" onClick={() => handleSortByRole('admin')}>
                              admin
                            </div>

                        </div>
                    )}
            </div>

        </div>


        
      </div>

      <p className='totalCount'>Найдено: {totalUsers}</p>


      <div className="table-user">
        <table className="table">
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Номер</th>
              <th>Дата регистрации</th>
              <th>В пути</th>
              <th>В архиве</th>
              <th>Общая кол-во</th>
              <th>Роль</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.name + ' ' + user.surname}</td>
                <td>{user.phone}</td>
                <td>{formatDate(user.createdAt)}</td>
                <td>{user.bookmarkCount}</td>
                <td>{user.archiveCount}</td>
                <td>{user.bookmarkCount + user.archiveCount}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="page-point-bar">
          <div className="page-point" onClick={handlePageChangeMinus}>
            Предыдущая страница
          </div>
          <div className="page-point">
            <label htmlFor="page">Номер страницы: </label>
            <input type="number" id="page" value={currentPage} onChange={handlePageChange} />
          </div>
          <div className="page-point">
            <label htmlFor="perPage">Кол-во: </label>
            <input type="number" id="perPage" value={perPage} onChange={handlePerPageChange} />
          </div>
          <div className="page-point" onClick={handlePageChangePlus}>
            Следующая страница
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
