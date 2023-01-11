import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { getData } from '../../apis/apis';
import { searchState } from '../../store/store';

interface dataType {
  sickCd: string;
  sickNm: string;
}

const SearchBar = () => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState<dataType[] | null>(null);
  const [select, setSelect] = useState(-1);

  const [searchResult, setSearchResult] = useRecoilState(searchState);

  // 데이터 가져오기
  const dataGet = () => {
    getData(search).then(res => {
      if (res.data.legnth === 0) {
        setData(null);
      }
      if (res.data.length !== 0) {
        setData(res.data);
        setSearchResult({ ...searchResult, [search]: res.data });
      }
    });
  };

  // up, down에 따른 요소 추천 검색어 포커싱
  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (data) {
      const keyCode = event.code;

      if (keyCode === 'ArrowUp' && select >= 1) {
        setSelect(select - 1);
      }
      if (keyCode === 'ArrowDown' && select < data.length - 1) {
        setSelect(select + 1);
      }

      if (keyCode === 'Enter') {
        setSearch(data[select].sickNm);
      }
    }
  };

  useEffect(() => {
    // 디바운스 처리 1초
    const debounce = setTimeout(() => {
      if (search) {
        const resultState = searchResult[search as keyof dataType];
        // 전역상태에 캐싱처리 (이렇게 하는게 맞는진 모르겠음)
        if (resultState) {
          setData(resultState);
          return;
        }

        if (resultState === undefined) {
          console.info('calling api');
          return dataGet();
        }
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
    <div onKeyUp={event => handleKeyUp(event)} className="flex flex-col w-full ">
      <input
        className="p-5 m-10 mb-0 w-300px h-16 text-12 border-2 rounded-5"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <ul className="mx-10 border-x-2 border-b-2 rounded-5">
        {data ? (
          data.map((sick, idx) => {
            return (
              <li
                key={sick.sickCd}
                className={`${idx === select ? 'bg-sky-400 text-white' : ''} p-5 w-300px`}
              >
                {sick.sickNm}
              </li>
            );
          })
        ) : (
          <li className="p-5 w-300px">검색어 없음</li>
        )}
      </ul>
    </div>
  );
};

export default SearchBar;
