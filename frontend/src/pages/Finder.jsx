import React, { useState, useEffect, useRef } from 'react';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import services from '../services';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const styleColors = {
  '中式': 'red',
  '西式': 'blue',
  '日式': 'yellow',
  '韓式': 'pink',
  '台式': 'green',
  '其他': 'purple'
};

function Finder() {
  const [foods, setFoods] = useState([]);
  const [filters, setFilters] = useState({
    style: [],
    type: [],
    price: [],
    travelTime: []
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const mapRef = useRef(null);

  const apiKey = import.meta.env.VITE_GOOGLEMAP_API_KEY;
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    id: 'google-map-script'
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const food = await services.user.getAll('');
        setFoods(food);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    }
    fetchData();
  }, []);

  const handleCheckboxChange = (event, category) => {
    const { value, checked } = event.target;
    if (checked) {
      setFilters(prevFilters => ({
        ...prevFilters,
        [category]: [...prevFilters[category], value]
      }));
    } else {
      setFilters(prevFilters => ({
        ...prevFilters,
        [category]: prevFilters[category].filter(item => item !== value)
      }));
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const queryString = new URLSearchParams(
        Object.entries(filters).reduce((acc, [key, values]) => {
          values.forEach(value => acc.append(key, value));
          return acc;
        }, new URLSearchParams())
      ).toString();

      const food = await services.user.getAll(queryString);
      setFoods(food);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const toggleFilterMenu = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFoodClick = (food) => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat: food.latitude, lng: food.longitude });
    }
  };

  if (!isLoaded) {
    return <div>餐廳列表加載所需時間視Render平台心情，請耐心等候...</div>;
  }

  return (
    <>
        <div className="flex h-screen">
            <div className="relative w-1/4 h-full overflow-y-scroll p-4 border-r border-gray-300">
                {foods.length > 0 ? (
                foods.map(food => (
                    <div key={food.id} className="mb-4 p-4 bg-white shadow rounded cursor-pointer" onClick={() => handleFoodClick(food)}>
                    <h2 className="text-xl font-bold">{food.name}</h2>
                    <p>料理形式: {food.style}</p>
                    <p>料理類別: {food.type}</p>
                    <p>價格: {food.price}</p>
                    <p>抵達所需時間: {food.travelTime} 分鐘</p>
                    <p>地址: {food.address}</p>
                    </div>
                ))
                ) : (
                <p>無餐廳，或是尚在等候資料庫回應。若太久仍未顯示可嘗試重新整理。</p>
                )}
            </div>
            <div className="w-3/4 h-full">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={{ lat: 25.0409803, lng: 121.521604 }}
                    zoom={16}
                    onLoad={map => (mapRef.current = map)}
                >
                {foods.map(food => (
                    food.latitude && food.longitude && (
                      <Marker
                        key={food.id}
                        position={{
                          lat: food.latitude,
                          lng: food.longitude
                        }}
                        icon={{
                          path: google.maps.SymbolPath.CIRCLE,
                          fillColor: styleColors[food.style] || 'gray',
                          fillOpacity: 1,
                          strokeWeight: 0,
                          scale: 10
                        }}
                        label={{
                          text: food.type,
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      />
                    )
                ))}
                </GoogleMap>
            </div>
        </div>
        <div
            className={`fixed top-0 right-0 w-1/4 h-full bg-white p-4 shadow-lg transition-transform transform ${
            isFilterOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{ zIndex: 1000 }}
        >
            <button
                className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2 bg-white text-black font-bold py-2 px-4 border rounded-l-lg"
                onClick={toggleFilterMenu}
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
                {isFilterOpen ? '收回' : '篩選條件'}
            </button>
            <form onSubmit={handleSubmit}>
              <fieldset>
                  <legend className="font-bold">料理形式:</legend>
                  <div className="grid grid-cols-3 gap-2">
                    {['中式', '西式', '日式', '韓式', '台式', '其他'].map((style) => (
                    <label key={style} className="block">
                        <input
                        type="checkbox"
                        name="style"
                        value={style}
                        onChange={(e) => handleCheckboxChange(e, 'style')}
                        checked={filters.style.includes(style)}
                        />
                        {style}
                    </label>
                    ))}
                  </div>
              </fieldset>

              <fieldset>
                  <legend className="font-bold">料理類別:</legend>
                  <div className="grid grid-cols-3 gap-2">
                    {['飯', '麵', '速食', '素食', '火鍋', '拉麵', '簡餐', '合菜', '其他'].map((type) => (
                    <label key={type} className="block">
                        <input
                        type="checkbox"
                        name="type"
                        value={type}
                        onChange={(e) => handleCheckboxChange(e, 'type')}
                        checked={filters.type.includes(type)}
                        />
                        {type}
                    </label>
                    ))}
                  </div>
              </fieldset>

              <fieldset>
                  <legend className="font-bold">價格:</legend>
                  <div className="grid grid-cols-3 gap-2">
                    {['便宜', '中等', '貴'].map((price) => (
                    <label key={price} className="block">
                        <input
                        type="checkbox"
                        name="price"
                        value={price}
                        onChange={(e) => handleCheckboxChange(e, 'price')}
                        checked={filters.price.includes(price)}
                        />
                        {price}
                    </label>
                    ))}
                  </div>
                  
              </fieldset>

              <fieldset>
                  <legend className="font-bold">抵達所需時間:</legend>
                  <div className="grid grid-cols-3 gap-2">
                    {['<5', '5-10', '10-20', '20-30', '>30'].map((travelTime) => (
                    <label key={travelTime} className="block">
                        <input
                        type="checkbox"
                        name="travelTime"
                        value={travelTime}
                        onChange={(e) => handleCheckboxChange(e, 'travelTime')}
                        checked={filters.travelTime.includes(travelTime)}
                        />
                        {travelTime}分鐘
                    </label>
                    ))}
                  </div>
                  
              </fieldset>

              <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                  篩選
              </button>
            </form>
        </div>
    </>
    
  );
}

export default Finder;
