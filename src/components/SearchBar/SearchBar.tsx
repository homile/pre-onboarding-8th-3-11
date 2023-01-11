import { useEffect, useState } from 'react';
import { getData } from '../../apis/apis';

interface dataType {
  sickCd: string;
  sickNm: string;
}

const SearchBar = () => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState<dataType[] | null>(null);
  const [select, setSelect] = useState(-1);

  // 데이터 가져오기
  const dataGet = () => {
    getData(search).then(res => {
      setData(res.data);
    });
  };

  // up, down에 따른 요소 추천 검색어 포커싱
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
    // 디바운스 처리 1초
    const debounce = setTimeout(() => {
      if (search) {
        return dataGet();
      }
      if (search === '') {
        setData(null);
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
      <ul>
        {data ? (
          data.map((sick, idx) => {
            return (
              <li key={sick.sickCd} className={`${idx === select ? 'text-red-400' : ''}`}>
                {sick.sickNm}
              </li>
            );
          })
        ) : (
          <li>검색어 없음</li>
        )}
      </ul>
    </div>
  );
};

export default SearchBar;
