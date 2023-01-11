import { useEffect, useState } from 'react';
import { getData } from '../../apis/apis';

interface dataType {
  sickCd: string;
  sickNm: string;
}

const SearchBar = () => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState<dataType[]>();
  const [select, setSelect] = useState(-1);

  const dataGet = () => {
    getData(search).then(res => {
      setData(res.data);
    });
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (data) {
      if (event.code === 'ArrowUp' && select >= 1) {
        setSelect(select - 1);
      }
      if (event.code === 'ArrowDown' && select < data.length - 1) {
        setSelect(select + 1);
      }
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (search) {
        return dataGet();
      }
      if (search === '') {
        setData([]);
      }
    }, 1000); //->setTimeout 설정
    return () => clearTimeout(debounce); //->clearTimeout 바로 타이머 제거
  }, [search]); //->결국 마지막 이벤트에만 setTimeout이 실행됨

  useEffect(() => {
    setSelect(-1);
  }, [data]);

  return (
    <div onKeyUp={event => handleKeyUp(event)}>
      <input
        className="p-5 m-10 w-300px h-16 text-12 border-2 rounded-5"
        onChange={e => setSearch(e.target.value)}
      />
      {data ? (
        <ul>
          {data.map((sick, idx) => {
            return (
              <li key={sick.sickCd} className={`${idx === select ? 'text-red-400' : ''}`}>
                {sick.sickNm}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};

export default SearchBar;
