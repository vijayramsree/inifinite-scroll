import { useEffect, useState } from 'react'

export default function UseSearchHooks(query, pageNumber) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  
  useEffect(() => {
    if(query !== ''){
        setLoading(true)
        const fetchData = async() => {
            try{
                const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmanufacturerdetails/${query}?page=${pageNumber}&format=json`);
                const resData = await response.json();
                console.log(resData.Results);
                if(resData.Results.length > 0) setHasMore(true);
                setData(prevData => {
                    return [...new Set([...prevData, ...resData.Results.map(item => item.City)])]
                })
                setLoading(false)
            }
            catch { 
                setError(true);
            }
        }
        fetchData();
    }
  }, [query, pageNumber])
  return { loading, data, error, hasMore }
}
