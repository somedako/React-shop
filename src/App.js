import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Drawer from './components/Drawer/Drawer';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import AppContext from './context';
import Orders from './pages/Orders';

function App() {
    const [items, setItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [cartOpened, setCartOpened] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    // useEffect(() => {
    //     fetch('https://6384e3f84ce192ac6066ac0f.mockapi.io/items')
    //         .then((res) => res.json())
    //         .then((json) => setItems(json));
    // }, []);
    useEffect(() => {
        try {
            async function fetchdata() {
                const [cartResponse, favoritesResponse, itemsResponse] =
                    await Promise.all([
                        axios.get(
                            'https://6384e3f84ce192ac6066ac0f.mockapi.io/cart'
                        ),
                        axios.get(
                            'https://6384e3f84ce192ac6066ac0f.mockapi.io/favorites'
                        ),
                        axios.get(
                            'https://6384e3f84ce192ac6066ac0f.mockapi.io/items'
                        ),
                    ]);
                // const cartResponse = await axios.get(
                //     'https://6384e3f84ce192ac6066ac0f.mockapi.io/cart'
                // );
                // const favoritesResponse = await axios.get(
                //     'https://6384e3f84ce192ac6066ac0f.mockapi.io/favorites'
                // );
                // const itemsResponse = await axios.get(
                //     'https://6384e3f84ce192ac6066ac0f.mockapi.io/items'
                // );

                setIsLoading(false);

                setCartItems(cartResponse.data);
                setFavorites(favoritesResponse.data);
                setItems(itemsResponse.data);
            }
            fetchdata();
        } catch (error) {
            alert('Ошибка при запросе данных');
            console.error(error);
        }
    }, []);

    const onAddToCart = async (item) => {
        try {
            const findItem = cartItems.find(
                (obj) => Number(obj.parentId) === Number(item.id)
            );
            if (findItem) {
                setCartItems((prev) =>
                    prev.filter(
                        (obj) => Number(obj.parentId) !== Number(item.id)
                    )
                );
                await axios.delete(
                    `https://6384e3f84ce192ac6066ac0f.mockapi.io/cart/${findItem.id}`
                );
            } else {
                setCartItems((prev) => [...prev, item]);
                const { data } = await axios.post(
                    'https://6384e3f84ce192ac6066ac0f.mockapi.io/cart',
                    item
                );
                setCartItems((prev) =>
                    prev.map((item) => {
                        if (item.parentId === data.parentId) {
                            return {
                                ...item,
                                id: data.id,
                            };
                        }
                        return item;
                    })
                );
            }
        } catch (error) {
            alert('Не получилось добавить в корзину');
            console.error(error);
        }
    };

    const onRemoveItem = async (id) => {
        try {
            await axios.delete(
                `https://6384e3f84ce192ac6066ac0f.mockapi.io/cart/${id}`
            );
            setCartItems((prev) =>
                prev.filter((item) => Number(item.id) !== Number(id))
            );
        } catch (error) {
            alert('Ошибка при удалении из корзины');
            console.error(error);
        }
    };

    const onAddToFavorite = async (item) => {
        try {
            if (favorites.find((obj) => Number(obj.id) === Number(item.id))) {
                axios.delete(
                    `https://6384e3f84ce192ac6066ac0f.mockapi.io/favorites/${item.id}`
                );
                setFavorites((prev) =>
                    prev.filter((obj) => obj.id !== item.id)
                );
            } else {
                const { data } = await axios.post(
                    'https://6384e3f84ce192ac6066ac0f.mockapi.io/favorites',
                    item
                );

                setFavorites((prev) => [...prev, data]);
            }
        } catch (error) {
            alert('Не удалось добавить в фавориты');
        }
    };

    const onSearchInput = (event) => {
        setSearchValue(event.target.value);
    };

    const isItemAdded = (id) => {
        return cartItems.some((obj) => Number(obj.parentId) === Number(id));
    };

    return (
        <AppContext.Provider
            value={{
                items,
                cartItems,
                favorites,
                isItemAdded,
                onAddToFavorite,
                onAddToCart,
                setCartOpened,
                setCartItems,
            }}
        >
            <div className="wrapper clear">
                <Drawer
                    onRemove={onRemoveItem}
                    items={cartItems}
                    onClose={() => setCartOpened(false)}
                    opened={cartOpened}
                />

                <Header onClickCart={() => setCartOpened(true)} />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Home
                                items={items}
                                cartItems={cartItems}
                                searchValue={searchValue}
                                setSearchValue={setSearchValue}
                                onSearchInput={onSearchInput}
                                onAddToFavorite={onAddToFavorite}
                                onAddToCart={onAddToCart}
                                isLoading={isLoading}
                            />
                        }
                    ></Route>
                    <Route path="/favorites" element={<Favorites />}></Route>
                    <Route path="/orders" element={<Orders />}></Route>
                </Routes>
            </div>
        </AppContext.Provider>
    );
}

export default App;
