import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import PropTypes from 'prop-types';

import {
  SearchbarStyle,
  SearchForm,
  SearchFormLabel,
  SearchFormButton,
  SearchFormInput,
} from './Searchbar.styled';

export default function Searchbar({ onSubmit }) {
  const [queryUser, setQueryUser] = useState('');

  const handlerChangeUserQuery = e => {
    setQueryUser(e.target.value);
  };

  const handelSubmitUserQuery = e => {
    e.preventDefault();
    if (queryUser === '') {
      return alert('Sorry, you need write something to start searching');
    }
    onSubmit(queryUser);
    setQueryUser('');
  };

  return (
    <SearchbarStyle>
      <SearchForm onSubmit={handelSubmitUserQuery}>
        <IconContext.Provider value={{ color: 'black', size: '25px' }}>
          <SearchFormButton type="submit">
            <FaSearch />
            <SearchFormLabel>Search</SearchFormLabel>
          </SearchFormButton>
        </IconContext.Provider>

        <SearchFormInput
          type="text"
          value={queryUser}
          onChange={handlerChangeUserQuery}
          autoFocus
          placeholder="Search images and photos"
        />
      </SearchForm>
    </SearchbarStyle>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
