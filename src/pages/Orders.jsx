import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Card from '../components/Card/Card';
import AppContext from '../context';

const Orders = () => {
    const { onAddToCart, onAddToFavorite } = useContext(AppContext);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(
                    'https://6384e3f84ce192ac6066ac0f.mockapi.io/orders'
                );
                // console.log(data.map(obj => obj.items).flat());
                setOrders(
                    data.reduce((prev, obj) => [...prev, ...obj.items], [])
                );
                setIsLoading(false);
            } catch (error) {
                alert('Ошибка при запросе заказов');
                console.log(error);
            }
        })();
    }, []);
    return (
        <div className="content p-40">
            <div className="d-flex align-center justify-between mb-40">
                <h1>Мои заказы</h1>
            </div>
            <div className="d-flex flex-wrap">
                {(isLoading ? [...Array(10)] : orders).map((item, index) => (
                    <Card
                        key={index}
                        onPlus={(obj) => onAddToCart(obj)}
                        onFavorite={(obj) => onAddToFavorite(obj)}
                        loading={isLoading}
                        {...item}
                    />
                ))}
            </div>
        </div>
    );
};

export default Orders;
