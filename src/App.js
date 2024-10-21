import './App.css';
import { useCallback, useRef, useState } from 'react';
import UseSearchHooks from './UseSearchHooks';
import useDebouncing from './useDebouncing';

function App() {
  const [query, setQuery] = useState('');
  const debouncedValue = useDebouncing(query, 300)
  const [pageNumber, setPageNumber] = useState(1);

  const { loading, data, error, hasMore } = UseSearchHooks(debouncedValue, pageNumber)

  const observer = useRef();
  const lastItemObserver = useCallback(node => {
    if(loading) return;
    if(observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting & hasMore) {
        setPageNumber(prevNumber => prevNumber + 1)
      }
    })

    if(node) observer.current.observe(node)
  }, [loading, hasMore])

  const handleChange = e => {
    setQuery(e.target.value)
    setPageNumber(1)
  }

  return (
    <div className="App">
     <h2>Inifinite Scroll</h2>
     <input type='text' value={query} onChange={handleChange} />
     {data.map((item, idx) => {
      if(data.length === idx + 1) {
        return <div ref={lastItemObserver} key={item}>{item}</div>
      }
      return <div key={item}>{item}</div>
     })}
     {loading && <div>loading...</div>}
     {error && <div>Error</div>}
    </div>
  );
}

export default App;
