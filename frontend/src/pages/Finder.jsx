import React, { useState, useEffect, useRef } from 'react';
import { useJsApiLoader, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
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
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
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

  useEffect(() => {
    if (selectedRestaurant && mapRef.current) {
      mapRef.current.panTo({ lat: selectedRestaurant.latitude, lng: selectedRestaurant.longitude });
    }
  }, [selectedRestaurant]);

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
    setSelectedRestaurant(food);
  };

  if (!isLoaded) {
    return <div>餐廳列表加載所需時間視Render平台心情，請耐心等候...</div>;
  }

  return (
    <>
        <div className="flex h-screen md:flex-row flex-col">
            <div className="relative md:w-1/4 md:h-full w-full h-1/3 overflow-y-scroll p-4 border-r border-gray-300">
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
            <div className="md:w-3/4 md:h-full w-full h-2/3">
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
                            scale: 15
                          }}
                          label={{
                            text: food.type,
                            color: (styleColors[food.style] === 'yellow' || styleColors[food.style] === 'pink') ? 'black' : 'white',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}
                          onClick={() => handleFoodClick(food)}
                        />
                      )
                  ))}
                  {selectedRestaurant && (
                    <InfoWindow
                      position={{
                        lat: selectedRestaurant.latitude,
                        lng: selectedRestaurant.longitude
                      }}
                      onCloseClick={() => setSelectedRestaurant(selectedRestaurant)}
                    >
                      <div>
                        <h2 className='font-bold'>{selectedRestaurant.name}</h2>
                        <p>{selectedRestaurant.address}</p>
                      </div>
                    </InfoWindow>
                  )}
                  <div className="absolute bottom-4 left-4 bg-white p-2 md:p-4 shadow-lg rounded">
                      <h3 className="text-sm md:text-base font-bold mb-2">料理形式顏色說明</h3>
                      <ul>
                        {Object.entries(styleColors).map(([style, color]) => (
                          <li key={style} className="flex items-center mb-1">
                            <span className={`block w-3 h-3 md:w-4 md:h-4 mr-2`} style={{ backgroundColor: color }}></span>
                            <span className="text-xs md:text-sm">{style}</span>
                          </li>
                        ))}
                      </ul>
                  </div>
                  
                </GoogleMap>
            </div>
        </div>
        <div
            className={`fixed top-0 right-0 md:w-1/4 w-3/4 h-full bg-white p-4 shadow-lg transition-transform transform ${
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
          <div className="h-full overflow-y-auto p-4">
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
          
        </div>        
    </>
  );
}

export default Finder;
